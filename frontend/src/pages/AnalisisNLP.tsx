function AnalisisNLP() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>Inteligencia NLP</h1>
        <p>
          Análisis y clasificación de comentarios mediante lenguaje natural.
        </p>
      </div>

      <div className="two-column-grid">
        <div className="content-panel">
          <div className="panel-title">
            <div>
              <h2>Analizar comentario</h2>
              <p>Escribe un comentario para analizarlo</p>
            </div>
          </div>

          <textarea
            className="comment-textarea"
            placeholder="Ejemplo: El servicio fue excelente y rápido..."
          />

          <button className="primary-button">
            Analizar comentario
          </button>
        </div>

        <div className="content-panel">
          <div className="panel-title">
            <div>
              <h2>Resultado referencial</h2>
              <p>Resultado del procesamiento NLP</p>
            </div>
          </div>

          <div className="nlp-result">
            <div>
              <span>Categoría</span>
              <strong>FELICITACIÓN</strong>
            </div>

            <div>
              <span>Palabras</span>
              <strong>7</strong>
            </div>

            <div>
              <span>Confianza</span>
              <strong>94%</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="content-panel">
        <div className="panel-title">
          <div>
            <h2>Palabras frecuentes</h2>
            <p>Términos encontrados en los comentarios</p>
          </div>
        </div>

        <div className="word-list">
          <span>servicio</span>
          <span>atención</span>
          <span>rápido</span>
          <span>producto</span>
          <span>soporte</span>
        </div>
      </div>
    </section>
  );
}

export default AnalisisNLP;