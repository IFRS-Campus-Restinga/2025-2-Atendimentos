import { useState } from "react";
import "./RegistroAtendimentoModal.css";

const RegistroAtendimentoModal = ({ eventoId, onClose, onSuccess }) => {
    const [dataAtendimento, setDataAtendimento] = useState("");
    const [descricao, setDescricao] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Enviar dados ao backend
        onSuccess({
            evento: eventoId,
            data_atendimento: dataAtendimento,
            descricao,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>Registrar Atendimento</h4>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <form className="registro-form" onSubmit={handleSubmit}>
                    <label>Data e Hora do Atendimento:</label>
                    <input
                        type="datetime-local"
                        value={dataAtendimento}
                        onChange={(e) => setDataAtendimento(e.target.value)}
                        required
                    />

                    <label>Descrição:</label>
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        maxLength={300}
                        required
                    />

                    <button type="submit">Salvar</button>
                </form>
            </div>
        </div>
    );
};

export default RegistroAtendimentoModal;
