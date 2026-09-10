from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy import text

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db

from app.schemas.biometria import (
    BiometriaRegistro,
    BiometriaRegistroResponse,
    BiometriaEstadoResponse,
    BiometriaVerificacion,
    BiometriaVerificacionResponse,
)

from app.services.biometria_service import (
    cifrar_embeddings,
    descifrar_embeddings,
    buscar_mejor_coincidencia,
)


router = APIRouter(
    prefix="/api/biometria",
    tags=["Biometría facial"],
)


# =========================================================
# REGISTRAR / ACTUALIZAR ROSTRO
# =========================================================

@router.post(
    "/registrar",
    response_model=BiometriaRegistroResponse,
)
async def registrar_biometria(
    datos: BiometriaRegistro,
    db: AsyncSession = Depends(get_db),
):

    email = (
        datos.usuario_email
        .strip()
        .lower()
    )


    # =====================================================
    # VALIDACIONES
    # =====================================================

    if not email:

        raise HTTPException(
            status_code=400,
            detail="El usuario es obligatorio",
        )


    if len(datos.embeddings) != 5:

        raise HTTPException(
            status_code=400,
            detail=(
                "Se requieren exactamente "
                "5 muestras faciales"
            ),
        )


    dimensiones = {
        len(embedding)
        for embedding
        in datos.embeddings
    }


    if len(dimensiones) != 1:

        raise HTTPException(
            status_code=400,
            detail=(
                "Todas las muestras deben "
                "tener la misma dimensión"
            ),
        )


    dimension = next(
        iter(dimensiones)
    )


    if dimension != 1024:

        raise HTTPException(
            status_code=400,
            detail=(
                f"Dimensión biométrica inválida: "
                f"{dimension}. Se esperaban 1024 valores."
            ),
        )


    # =====================================================
    # CIFRAR
    # =====================================================

    try:

        embeddings_cifrados = (
            cifrar_embeddings(
                datos.embeddings
            )
        )

    except Exception as exc:

        print(
            "Error cifrando biometría:",
            exc
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "No se pudo proteger "
                "la información biométrica"
            ),
        )


    # =====================================================
    # GUARDAR
    # =====================================================

    consulta = text("""
        INSERT INTO biometria_facial (
            usuario_email,
            embeddings_encrypted,
            cantidad_muestras,
            activo,
            created_at,
            updated_at
        )
        VALUES (
            :usuario_email,
            :embeddings_encrypted,
            :cantidad_muestras,
            TRUE,
            NOW(),
            NOW()
        )

        ON CONFLICT (usuario_email)

        DO UPDATE SET
            embeddings_encrypted =
                EXCLUDED.embeddings_encrypted,

            cantidad_muestras =
                EXCLUDED.cantidad_muestras,

            activo = TRUE,

            updated_at = NOW()

        RETURNING
            id,
            usuario_email,
            cantidad_muestras;
    """)


    try:

        resultado = await db.execute(
            consulta,
            {
                "usuario_email": email,

                "embeddings_encrypted":
                    embeddings_cifrados,

                "cantidad_muestras":
                    len(datos.embeddings),
            },
        )


        fila = resultado.mappings().one()


        await db.commit()


    except Exception as exc:

        await db.rollback()

        print(
            "Error guardando biometría:",
            exc
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "No se pudo guardar "
                "la biometría facial"
            ),
        )


    return {
        "id": fila["id"],

        "usuario_email":
            fila["usuario_email"],

        "cantidad_muestras":
            fila["cantidad_muestras"],

        "registrado": True,

        "mensaje":
            "Biometría facial registrada correctamente",
    }


# =========================================================
# CONSULTAR ESTADO
# =========================================================

@router.get(
    "/estado/{usuario_email}",
    response_model=BiometriaEstadoResponse,
)
async def estado_biometria(
    usuario_email: str,
    db: AsyncSession = Depends(get_db),
):

    email = (
        usuario_email
        .strip()
        .lower()
    )


    resultado = await db.execute(
        text("""
            SELECT
                usuario_email,
                cantidad_muestras,
                activo

            FROM biometria_facial

            WHERE usuario_email = :email

            LIMIT 1;
        """),
        {
            "email": email,
        },
    )


    fila = (
        resultado
        .mappings()
        .first()
    )


    if not fila:

        return {
            "usuario_email": email,
            "registrado": False,
            "cantidad_muestras": 0,
            "activo": False,
        }


    return {
        "usuario_email":
            fila["usuario_email"],

        "registrado": True,

        "cantidad_muestras":
            fila["cantidad_muestras"],

        "activo":
            fila["activo"],
    }

# =========================================================
# VERIFICAR IDENTIDAD FACIAL
# =========================================================

@router.post(
    "/verificar",
    response_model=BiometriaVerificacionResponse,
)
async def verificar_biometria(
    datos: BiometriaVerificacion,
    db: AsyncSession = Depends(get_db),
):

    email = (
        datos.usuario_email
        .strip()
        .lower()
    )


    # =====================================================
    # VALIDAR EMBEDDING RECIBIDO
    # =====================================================

    if len(datos.embedding) != 1024:

        raise HTTPException(
            status_code=400,
            detail=(
                "El descriptor facial "
                "no tiene una dimensión válida"
            ),
        )


    # =====================================================
    # BUSCAR BIOMETRÍA
    # =====================================================

    resultado = await db.execute(
        text("""
            SELECT
                usuario_email,
                embeddings_encrypted,
                activo

            FROM biometria_facial

            WHERE usuario_email = :email

            LIMIT 1;
        """),
        {
            "email": email,
        },
    )


    fila = (
        resultado
        .mappings()
        .first()
    )


    # =====================================================
    # USUARIO SIN BIOMETRÍA
    # =====================================================

    if not fila:

        return {
            "verificado": False,
            "usuario_email": email,
            "similitud": 0.0,
            "muestra_coincidente": None,
            "mensaje": (
                "El usuario no tiene "
                "biometría facial registrada."
            ),
        }


    # =====================================================
    # BIOMETRÍA DESACTIVADA
    # =====================================================

    if not fila["activo"]:

        return {
            "verificado": False,
            "usuario_email": email,
            "similitud": 0.0,
            "muestra_coincidente": None,
            "mensaje": (
                "La autenticación facial "
                "está desactivada."
            ),
        }


    # =====================================================
    # DESCIFRAR MUESTRAS
    # =====================================================

    try:

        muestras = descifrar_embeddings(
            fila["embeddings_encrypted"]
        )

    except Exception as exc:

        print(
            "Error descifrando biometría:",
            exc,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "No se pudo procesar "
                "la biometría registrada"
            ),
        )


    # =====================================================
    # COMPARAR
    # =====================================================

    indice, similitud = (
        buscar_mejor_coincidencia(
            datos.embedding,
            muestras,
        )
    )


    # =====================================================
    # UMBRAL INICIAL
    # =====================================================

    UMBRAL_IDENTIDAD = 0.50


    verificado = (
        similitud >=
        UMBRAL_IDENTIDAD
    )


    return {
        "verificado":
            verificado,

        "usuario_email":
            email,

        "similitud":
            similitud,

        "muestra_coincidente":
            (
                indice + 1
                if indice is not None
                else None
            ),

        "mensaje":
            (
                "Identidad facial verificada."
                if verificado
                else
                "El rostro no coincide con el usuario."
            ),
    }