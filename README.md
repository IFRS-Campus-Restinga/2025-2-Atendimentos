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

```
python -m venv venv
```

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
npm install axios
npm install jwt-decode
npm install @react-oauth/google
```

coloque o arquivo .env pra conseguir usar o google


### Inicie o servidor de desenvolvimento
```
npm run dev
```

---

## 👩‍💻 Como começar a codar (Fluxo de trabalho com Git)

### Entre na sua branch de trabalho:
```
git checkout seu-nome
```

### Atualize sua branch com as últimas mudanças da develop:
```
git pull origin develop
```

### Comece a codar normalmente.


### Verifique o status dos arquivos:
```
git status
```

### 
Antes de commitar, garanta que não há conflitos trazendo novamente a develop:
```
git pull origin develop
```

### Adicione e commite suas alterações:
```
git add .
git commit -m "Descreva sua alteração"
```

### Envie suas alterações para o repositório remoto:
```
git push origin sua-branch
```

## 🧰 Comandos Git úteis

Salvar alterações temporariamente (stash)
Guarda suas alterações não commitadas para limpar o diretório de trabalho:
```
git stash
```

Recuperar alterações salvas com stash
Restaura as alterações guardadas pelo último stash:
```
git stash pop
```

Aplicar um commit específico de outra branch (cherry-pick)
Aplica um commit de outra branch na sua branch atual:
```
git cherry-pick <hash-do-commit>
```
