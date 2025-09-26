import React, { useState } from 'react';
import axios from 'axios';

function FormularioAluno({ onAlunoAdicionado }) {
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const novoAluno = {
            nome_completo: nome,
            matricula: parseInt(matricula, 10),
            alunoEspecial: false, 
        };

        axios.post('http://localhost:8000/api/alunos/', novoAluno)
            .then(response => {
                
                onAlunoAdicionado(response.data);
                setNome('');
                setMatricula('');
            })
            .catch(error => {
                console.error("Erro ao criar aluno!", error.response.data);
                alert("Erro: " + JSON.stringify(error.response.data));
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Adicionar Novo Aluno</h3>
            <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome Completo"
                required
            />
            <input
                type="number"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Matrícula"
                required
            />
            <button type="submit">Adicionar</button>
        </form>
    );
}

export default FormularioAluno;