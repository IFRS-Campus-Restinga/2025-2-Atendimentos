# 📚 Sistema de Atendimento - IFRS Campus Restinga

Este é um sistema de **atendimento acadêmico** desenvolvido para o **IFRS - Campus Restinga**, com o objetivo de facilitar a comunicação entre **professores e alunos**. O sistema permite que professores realizem atendimentos agendados e que alunos solicitem atendimentos.

---

## 📁 Estrutura do Projeto

O projeto está organizado da seguinte forma:

├── backend/ # Backend com Django

└── frontend/ # Frontend com React + Vite

---

## 🚀 Tecnologias Utilizadas

### Backend (Django)

- **Python**: ≥ 3.10
- **Django**: 5.0.x
- **pip** / **venv** para gerenciamento de dependências

### Frontend (React)

- **Node.js**: 18.13.x ou superior
- **React**: 18.2.x
- **Vite**: 5.x

---

## 🛠️ Como Executar o Projeto Localmente

Siga os passos abaixo para rodar tanto o backend quanto o frontend em ambiente local.

---

### 📥 1. Clone o repositório

```bash
git clone https://github.com/IFRS-Campus-Restinga/2025-2-Atendimentos.git
cd 2025-2-Atendimentos
```

## 🔙 2. Executar o Backend (Django)
```
cd backend
cd app
```

### Crie um ambiente virtual
python -m venv venv

### Ative o ambiente virtual
### No Windows:
```
venv\Scripts\activate
```
### No Linux/Mac:
```
source venv/bin/activate
```

### Instale as dependências
```
pip install -r requirements.txt
```

### Execute as migrações
```
python manage.py migrate
```

### Inicie o servidor
```
python manage.py runserver
```

## 🖥️ 3. Executar o Frontend (React + Vite)

### Abra um novo terminal na raiz do projeto:

```
cd frontend
cd app
```

### Instale as dependências
```
npm install
```

### Inicie o servidor de desenvolvimento
```
npm run dev
```
