import { useState } from 'react'
import logo from '/logo.svg'
import './App.css'

function App() {
  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = "/recibo.pdf"; // Caminho atualizado para o arquivo PDF
    link.download = "recibo.pdf"; // Nome do arquivo para download
    link.click();
  };

  return (
    <>
      <div>
        <a href="https://papito.dev" target="_blank">
          <img src={logo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h2>Download PDF 👇</h2>
      <div className="card">
        <button data-cy="download" onClick={downloadPDF}>Download PDF</button>
      </div>
      <p className="read-the-docs">
        Made with S2 by Papito
      </p>
    </>
  )
}

export default App
