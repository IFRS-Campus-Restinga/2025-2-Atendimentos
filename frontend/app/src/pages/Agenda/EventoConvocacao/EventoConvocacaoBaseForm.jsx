import { useState, useEffect } from "react";
import { getApiUrl, getAuthHeaders } from "../../../services/api";

const EventoConvocacaoForm = ({
  mode = "create",
  initialValues,
  onSuccess,
  onCancel,
  extraFooter,
}) => {
  const [dataEvento, setDataEvento] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [disciplinaId, setDisciplinaId] = useState("");
  const [alunoId, setAlunoId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [sala, setSala] = useState("");
  const [sending, setSending] = useState(false);

  // Preenche valores iniciais se for edição
  useEffect(() => {
    if (mode !== "edit" || !initialValues) return;
    if (initialValues.data_evento) setDataEvento(String(initialValues.data_evento));
    if (initialValues.hora_evento_inicio)
      setHoraInicio(String(initialValues.hora_evento_inicio).slice(0, 5));
    if (initialValues.hora_evento_fim)
      setHoraFim(String(initialValues.hora_evento_fim).slice(0, 5));
    if (initialValues.curso) setCursoId(String(initialValues.curso));
    if (initialValues.disciplina) setDisciplinaId(String(initialValues.disciplina));
    if (initialValues.aluno) setAlunoId(String(initialValues.aluno));
    if (initialValues.mensagem) setMensagem(initialValues.mensagem);
    if (typeof initialValues.sala !== "undefined" && initialValues.sala !== null)
      setSala(String(initialValues.sala));
  }, [mode, initialValues]);

  // Carregar cursos e disciplinas
  useEffect(() => {
    fetch(getApiUrl("cursos"))
      .then((res) => res.json())
      .then((data) => setCursos(Array.isArray(data) ? data : data?.results || []))
      .catch((err) => console.error("Erro ao buscar cursos:", err));

    fetch(getApiUrl("disciplinas"))
      .then((res) => res.json())
      .then((data) => setDisciplinas(Array.isArray(data) ? data : data?.results || []))
      .catch((err) => console.error("Erro ao buscar disciplinas:", err));
  }, []);

  // Buscar alunos vinculados ao curso selecionado e com tipoPerfil = ALU
useEffect(() => {
  if (!cursoId) {
    setAlunos([]);
    return;
  }

  fetch(getApiUrl(`/services/usuario/?curso=${cursoId}&tipoPerfil=ALU`), {
    headers: getAuthHeaders(),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Erro HTTP ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      const lista = Array.isArray(data) ? data : data?.results || [];
      const filtrados = lista.filter(
        (u) => u.tipoPerfil === "ALU" && String(u.curso) === String(cursoId)
      );
      setAlunos(filtrados);
    })
    .catch((err) => console.error("Erro ao buscar alunos do curso:", err));
  }, [cursoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataEvento || !horaInicio || !horaFim || !cursoId || !disciplinaId || !alunoId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    // Validações de data e horário
    const hoje = new Date();
    const dataSelecionada = new Date(dataEvento);
    if (dataSelecionada <= hoje) {
      alert("A data do evento deve ser maior que hoje.");
      return;
    }

    const [hIni, mIni] = horaInicio.split(":").map(Number);
    const minutosInicio = hIni * 60 + mIni;
    if (minutosInicio < (7 * 60 + 30) || minutosInicio > 22 * 60) {
      alert("Horário de início deve estar entre 07:30 e 22:00.");
      return;
    }

    const [hFim, mFim] = horaFim.split(":").map(Number);
    const minutosFim = hFim * 60 + mFim;
    if (minutosFim < 8 * 60 || minutosFim > (22 * 60 + 30)) {
      alert("Horário de término deve estar entre 08:00 e 22:30.");
      return;
    }

    const duracaoMin = minutosFim - minutosInicio;
    if (duracaoMin < 30) {
      alert("A duração mínima do atendimento é de 30 minutos.");
      return;
    }

    const payload = {
      data_evento: dataEvento,
      hora_evento_inicio: horaInicio,
      hora_evento_fim: horaFim,
      curso: Number(cursoId),
      disciplina: Number(disciplinaId),
      aluno: Number(alunoId),
      mensagem,
      limite: 1,
      sala: sala || null,
      status_atendimento: true,
    };

    setSending(true);
    try {
      const res = await fetch(getApiUrl("/services/evento-convocacao/"), {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Erro ao salvar convocação");
      onSuccess?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form" id="evento-convocacao-form">
      <div className="form-section-box">
        <div className="form-section-title">Data do Evento</div>
        <input
          type="date"
          className="form-control"
          value={dataEvento}
          onChange={(e) => setDataEvento(e.target.value)}
          required
        />
      </div>

      <div className="form-section-box">
        <div className="form-section-title">Horário</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <label>Início</label>
            <input
              type="time"
              className="form-control"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Término</label>
            <input
              type="time"
              className="form-control"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section-box">
        <div className="form-section-title">Curso e Disciplina</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <label>Curso</label>
            <select
              className="form-select"
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
              required
            >
              <option value="">Selecione o curso</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Disciplina</label>
            <select
              className="form-select"
              value={disciplinaId}
              onChange={(e) => setDisciplinaId(e.target.value)}
              required
            >
              <option value="">Selecione a disciplina</option>
              {disciplinas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
          <div className="form-section-box">
          <div className="form-section-title">Aluno</div>
          <select
            className="form-select"
            value={alunoId}
            onChange={(e) => setAlunoId(e.target.value)}
            required
            disabled={!cursoId}
          >
            <option value="">Selecione o aluno</option>
            {alunos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome} ({a.email})
              </option>
            ))}
          </select>
        </div>
        <div className="form-section-box">
        <div className="form-section-title">Mensagem</div>
        <textarea
          className="form-control"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={3}
          placeholder="Escreva uma mensagem para o aluno convocado..."
        />
      </div>

      <div className="form-section-box">
        <div className="form-section-title">Opções</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <label>Limite</label>
            <input
              type="number"
              className="form-control"
              value={1}
              disabled
            />
          </div>
          <div>
            <label>Sala (opcional)</label>
            <input
              type="text"
              className="form-control"
              value={sala}
              onChange={(e) => setSala(e.target.value)}
              placeholder="Ex.: Sala 102"
            />
          </div>
        </div>
      </div>

      {extraFooter}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel || onSuccess}
        >
          Fechar
        </button>
        <button
          type="submit"
          className="btn btn-success"
          disabled={sending}
        >
          {sending ? "Salvando..." : mode === "edit" ? "Salvar alterações" : "Salvar"}
        </button>
      </div>
    </form>
  );
};

export default EventoConvocacaoForm;