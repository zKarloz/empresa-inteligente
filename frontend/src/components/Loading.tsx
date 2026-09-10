interface LoadingProps {
  texto?: string;
}

function Loading({
  texto = "Cargando información..."
}: LoadingProps) {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />

      <p>{texto}</p>
    </div>
  );
}

export default Loading;