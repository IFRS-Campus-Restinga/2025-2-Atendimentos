import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioAluno from '../components/FormularioAluno';

function Alunos() {
    const [alunos, setAlunos] = useState([]);

    const fetchAlunos = () => {
        axios.get('http://localhost:8000/api/alunos/')
            .then(response => {
                setAlunos(response.data);
            })
            .catch(error => {
                console.error("Houve um erro na requisição!", error);
            });
    };

    useEffect(() => {
        fetchAlunos(); 
    }, []);

    const handleAlunoAdicionado = (novoAluno) => {
        setAlunos([...alunos, novoAluno]);
    };

    return (
        <div>
            <h1>CRUD de Alunos</h1>
            
            <FormularioAluno onAlunoAdicionado={handleAlunoAdicionado} />
            
            <hr />
            
            <h2>Lista de Alunos</h2>
            <ul>
                {alunos.map(aluno => (
                    <li key={aluno.id}>
                        {aluno.nome_completo} - Matrícula: {aluno.matricula}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Alunos;