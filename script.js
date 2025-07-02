window.onload = () => {
  let doutores = JSON.parse(localStorage.getItem('doutores')) || [];
let consultas = JSON.parse(localStorage.getItem('consultas')) || [];

const doutorForm = document.getElementById('doutor-form');
const doutorNome = document.getElementById('doutor-nome');
const doutoresLista = document.getElementById('doutores-lista');
const selectDoutor = document.getElementById('agendamento-doutor');

const consultaForm = document.getElementById('consulta-form');
const consultaNome = document.getElementById('consulta-nome');
const consultasLista = document.getElementById('consultas-lista');
const selectConsulta = document.getElementById('agendamento-consulta');


  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!usuarioLogado) {
    window.location.href = 'login.html';
    return;
  }

  // Logout
  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
  });

  // Elementos do DOM
  const clienteForm = document.getElementById('cliente-form');
  const clientesLista = document.getElementById('clientes-lista');
  const agendamentoCliente = document.getElementById('agendamento-cliente');

  const agendamentoForm = document.getElementById('agendamento-form');
  const agendamentoData = document.getElementById('agendamento-data');
  const agendamentoHora = document.getElementById('agendamento-hora');
  const agendamentoDoutor = document.getElementById('agendamento-doutor');
  const agendamentoConsulta = document.getElementById('agendamento-consulta');
  const agendamentoLocal = document.getElementById('agendamento-local');
  const agendamentosLista = document.getElementById('agendamentos-lista');

  const tabButtons = document.querySelectorAll('#menuTabs button.nav-link');

  // Dados locais
  let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

  // Renderizar clientes
  function atualizarListaClientes(lista) {
  clientesLista.innerHTML = '';
  agendamentoCliente.innerHTML = '<option value="" disabled selected>Selecione um cliente</option>';

  lista.forEach((cliente, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row';

    // Conteúdo do cliente
    const span = document.createElement('span');
    span.textContent = `${cliente.nome} | ${cliente.email} | ${cliente.telefone}`;

    // Botões
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group btn-group-sm mt-2 mt-md-0';

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.className = 'btn btn-warning';
    btnEditar.addEventListener('click', () => editarCliente(index));

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.className = 'btn btn-danger';
    btnExcluir.addEventListener('click', () => excluirCliente(index));

    buttonGroup.appendChild(btnEditar);
    buttonGroup.appendChild(btnExcluir);

    li.appendChild(span);
    li.appendChild(buttonGroup);
    clientesLista.appendChild(li);

    // Adiciona também ao select de agendamento
    const option = document.createElement('option');
    option.value = index;
    option.textContent = cliente.nome;
    agendamentoCliente.appendChild(option);
  });
}


  function renderClientes() {
    atualizarListaClientes(clientes);
  }
  function editarCliente(index) {
  const cliente = clientes[index];
  if (!cliente) return;

  // Preenche os campos com os dados existentes
  document.getElementById('cliente-nome').value = cliente.nome;
  document.getElementById('cliente-email').value = cliente.email;
  document.getElementById('cliente-telefone').value = cliente.telefone;

  // Remove o cliente atual e aguarda o novo cadastro para sobrescrevê-lo
  clientes.splice(index, 1);
  localStorage.setItem('clientes', JSON.stringify(clientes));
  renderClientes();

  alert('Edite os dados no formulário e clique em "Cadastrar" para atualizar.');
}

function excluirCliente(index) {
  if (confirm('Tem certeza que deseja excluir este cliente?')) {
    clientes.splice(index, 1);

    // Também remove agendamentos associados a esse cliente
    agendamentos = agendamentos.filter(a => a.clienteIndex !== index);

    // Atualiza os índices dos agendamentos restantes
    agendamentos.forEach((a, i) => {
      if (a.clienteIndex > index) {
        a.clienteIndex -= 1;
      }
    });

    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    renderClientes();
    renderAgendamentos();
  }
}


  // Busca de clientes
  document.getElementById('busca-cliente').addEventListener('input', () => {
    const termo = document.getElementById('busca-cliente').value.toLowerCase();
    const filtrados = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.telefone.toLowerCase().includes(termo)
    );
    atualizarListaClientes(filtrados);
  });

  // Renderizar agendamentos
  function renderAgendamentos() {
    agendamentosLista.innerHTML = '';

    let filtrados = [...agendamentos];
    const filtroData = document.getElementById('filtro-data').value;
    const filtroDoutor = document.getElementById('filtro-doutor').value.toLowerCase();
    const filtroStatus = document.getElementById('filtro-status').value;

    if (filtroData) {
      filtrados = filtrados.filter(a => a.data === filtroData);
    }
    if (filtroDoutor) {
      filtrados = filtrados.filter(a => a.doutor.toLowerCase().includes(filtroDoutor));
    }
    if (filtroStatus) {
      filtrados = filtrados.filter(a => a.status === filtroStatus);
    }

    if (filtrados.length === 0) {
      agendamentosLista.innerHTML = '<p>Nenhum agendamento encontrado com os filtros.</p>';
      return;
    }

    filtrados.forEach((agendamento) => {
      const cliente = clientes[agendamento.clienteIndex];
      if (!cliente) return;

      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `
        <strong>Cliente:</strong> ${cliente.nome} |
        <strong>Data:</strong> ${agendamento.data} |
        <strong>Hora:</strong> ${agendamento.hora} |
        <strong>Doutor:</strong> ${agendamento.doutor} |
        <strong>Consulta:</strong> ${agendamento.consulta} |
        <strong>Local:</strong> ${agendamento.local} |
        <strong>Status:</strong> ${agendamento.status || 'pendente'}
      `;
      agendamentosLista.appendChild(li);
    });
  }

  // Eventos dos filtros
  document.getElementById('filtro-data').addEventListener('input', renderAgendamentos);
  document.getElementById('filtro-doutor').addEventListener('input', renderAgendamentos);
  document.getElementById('filtro-status').addEventListener('change', renderAgendamentos);
  document.getElementById('limpar-filtros').addEventListener('click', () => {
    document.getElementById('filtro-data').value = '';
    document.getElementById('filtro-doutor').value = '';
    document.getElementById('filtro-status').value = '';
    renderAgendamentos();
  });

  // Formulário de cliente
  clienteForm.addEventListener('submit', (e) => {
    e.preventDefault();
   
    const nome = document.getElementById('cliente-nome').value.trim();
    const email = document.getElementById('cliente-email').value.trim();
    const telefone = document.getElementById('cliente-telefone').value.trim();

    if (nome && email && telefone) {
        console.log('Cliente será salvo:', { nome, email, telefone });

      clientes.push({ nome, email, telefone });
      localStorage.setItem('clientes', JSON.stringify(clientes));
      renderClientes();
      clienteForm.reset();

      const agendamentosTab = new bootstrap.Tab(document.getElementById('agendamentos-tab'));
      agendamentosTab.show();
      document.querySelector('main.container').scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('Preencha todos os campos do cadastro.');
    }
  });

  // Formulário de agendamento
  agendamentoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const clienteIndex = agendamentoCliente.value;
    const data = agendamentoData.value;
    const hora = agendamentoHora.value;
    const doutor = agendamentoDoutor.value.trim();
    const consulta = agendamentoConsulta.value.trim();
    const local = agendamentoLocal.value.trim();

    if (!clienteIndex || !data || !hora || !doutor || !consulta || !local) {
      alert('Por favor, preencha todos os campos para agendar.');
      return;
    }

    const novoAgendamento = {
      clienteIndex: Number(clienteIndex),
      data,
      hora,
      doutor,
      consulta,
      local,
      status: 'pendente'
    };

    agendamentos.push(novoAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    renderAgendamentos();
    agendamentoForm.reset();
    document.querySelector('main.container').scrollIntoView({ behavior: 'smooth' });
  });

  // Relatório
  const btnGerarRelatorio = document.getElementById('btn-gerar-relatorio');
  const relatorioResult = document.getElementById('relatorio-result');

  btnGerarRelatorio.addEventListener('click', () => {
    if (agendamentos.length === 0) {
      relatorioResult.innerHTML = '<p>Nenhum agendamento para exibir no relatório.</p>';
      return;
    }

    let tabela = `
      <table class="table table-striped table-bordered">
        <thead class="table-dark">
          <tr>
            <th>Cliente</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Doutor</th>
            <th>Consulta</th>
            <th>Local</th>
          </tr>
        </thead>
        <tbody>
    `;

    agendamentos.forEach((agendamento) => {
      const cliente = clientes[agendamento.clienteIndex];
      if (!cliente) return;

      tabela += `
        <tr>
          <td>${cliente.nome}</td>
          <td>${cliente.email}</td>
          <td>${cliente.telefone}</td>
          <td>${agendamento.data}</td>
          <td>${agendamento.hora}</td>
          <td>${agendamento.doutor}</td>
          <td>${agendamento.consulta}</td>
          <td>${agendamento.local}</td>
        </tr>
      `;
    });

    tabela += '</tbody></table>';
    relatorioResult.innerHTML = tabela;
    relatorioResult.scrollIntoView({ behavior: 'smooth' });
  });

  // Scroll suave nas abas
  tabButtons.forEach((button) => {
    button.addEventListener('shown.bs.tab', () => {
      document.querySelector('main.container').scrollIntoView({ behavior: 'smooth' });
    });
  });

  function renderDoutores() {
  doutoresLista.innerHTML = '';
  selectDoutor.innerHTML = '<option disabled selected>Selecione um doutor</option>';
  doutores.forEach((nome, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = nome;
    doutoresLista.appendChild(li);

    const option = document.createElement('option');
    option.value = nome;
    option.textContent = nome;
    selectDoutor.appendChild(option);
  });
}

function renderConsultas() {
  consultasLista.innerHTML = '';
  selectConsulta.innerHTML = '<option disabled selected>Selecione a consulta</option>';
  consultas.forEach((nome, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = nome;
    consultasLista.appendChild(li);

    const option = document.createElement('option');
    option.value = nome;
    option.textContent = nome;
    selectConsulta.appendChild(option);
  });
}
doutorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = doutorNome.value.trim();
  if (nome) {
    doutores.push(nome);
    localStorage.setItem('doutores', JSON.stringify(doutores));
    renderDoutores();
    doutorForm.reset();
  }
});

consultaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = consultaNome.value.trim();
  if (nome) {
    consultas.push(nome);
    localStorage.setItem('consultas', JSON.stringify(consultas));
    renderConsultas();
    consultaForm.reset();
  }
});

  // Inicialização
  renderClientes();
  renderDoutores();
renderConsultas();

}