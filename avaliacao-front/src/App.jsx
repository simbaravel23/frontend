import React, { useState, useEffect } from 'react';
import './App.css'; // Importa seu arquivo CSS para estilos

// Componente de Dashboard
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // A URL real da sua API de backend para o dashboard
        const response = await fetch('https://listadefilmes-adtf.onrender.com/api/movies/dashboard-summary');
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Erro ao carregar dados do Dashboard:", err);
        setError("Erro: Não foi possível carregar os dados do Dashboard. Verifique a conexão com a API.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <p>Carregando dados do Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
        <p>Por favor, verifique se o seu backend está rodando e acessível.</p>
      </div>
    );
  }

  // Renderiza os dados do dashboard
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* Seção: Anos com Múltiplos Vencedores */}
      <div className="dashboard-section">
        <h2>Anos com Mais de Um Vencedor</h2>
        {data && data.yearsWithMultipleWinners && data.yearsWithMultipleWinners.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Ano</th>
                <th>Quantidade de Vencedores</th>
              </tr>
            </thead>
            <tbody>
              {data.yearsWithMultipleWinners.map((item) => (
                <tr key={item.year}>
                  <td>{item.year}</td>
                  <td>{item.winnerCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum dado de anos com múltiplos vencedores disponível.</p>
        )}
      </div>

      {/* Seção: Estúdios com Mais Vitórias */}
      <div className="dashboard-section">
        <h2>Estúdios com Mais Vitórias</h2>
        {data && data.studiosWithWinCount && data.studiosWithWinCount.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Estúdio</th>
                <th>Contagem de Vitórias</th>
              </tr>
            </thead>
            <tbody>
              {data.studiosWithWinCount.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.winCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum dado de estúdios com vitórias disponível.</p>
        )}
      </div>

      {/* Seção: Produtores com Maior e Menor Intervalo entre Vitórias */}
      <div className="dashboard-section">
        <h2>Produtores com Maior e Menor Intervalo entre Vitórias</h2>
        {data && data.maxMinWinIntervalForProducers ? (
          <>
            <h3>Menor Intervalo</h3>
            {data.maxMinWinIntervalForProducers.min && data.maxMinWinIntervalForProducers.min.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Produtor</th>
                    <th>Intervalo</th>
                    <th>Vitória Anterior</th>
                    <th>Próxima Vitória</th>
                  </tr>
                </thead>
                <tbody>
                  {data.maxMinWinIntervalForProducers.min.map((item, index) => (
                    <tr key={index}>
                      <td>{item.producer}</td>
                      <td>{item.interval}</td>
                      <td>{item.previousWin}</td>
                      <td>{item.followingWin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhum produtor com menor intervalo encontrado.</p>
            )}

            <h3>Maior Intervalo</h3>
            {data.maxMinWinIntervalForProducers.max && data.maxMinWinIntervalForProducers.max.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Produtor</th>
                    <th>Intervalo</th>
                    <th>Vitória Anterior</th>
                    <th>Próxima Vitória</th>
                  </tr>
                </thead>
                <tbody>
                  {data.maxMinWinIntervalForProducers.max.map((item, index) => (
                    <tr key={index}>
                      <td>{item.producer}</td>
                      <td>{item.interval}</td>
                      <td>{item.previousWin}</td>
                      <td>{item.followingWin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhum produtor com maior intervalo encontrado.</p>
            )}
          </>
        ) : (
          <p>Nenhum dado de produtores com intervalo de vitórias disponível.</p>
        )}
      </div>
    </div>
  );
};

// Componente de MovieList
const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchYear, setSearchYear] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // A URL real da sua API de backend para a lista de filmes
        const response = await fetch('https://listadefilmes-adtf.onrender.com/api/movies');
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const result = await response.json();
        // A API de lista de filmes retorna um objeto com 'content'
        setMovies(result.content);
        setFilteredMovies(result.content); // Inicialmente, todos os filmes são exibidos
      } catch (err) {
        console.error("Erro ao carregar lista de filmes:", err);
        setError("Erro: Não foi possível carregar a lista de filmes. Verifique a conexão com a API.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = () => {
    if (searchYear) {
      const year = parseInt(searchYear);
      if (!isNaN(year)) {
        const filtered = movies.filter(movie => movie.year === year);
        setFilteredMovies(filtered);
      } else {
        // Melhorar isso para um modal ou mensagem na UI, não alert()
        // Por favor, evite usar alert() em aplicações web.
        // Implemente um modal ou uma mensagem na interface do usuário.
        console.warn('Por favor, insira um ano válido.');
      }
    } else {
      setFilteredMovies(movies); // Se a busca estiver vazia, mostra todos os filmes
    }
  };

  if (loading) {
    return (
      <div className="movie-list-container">
        <h1>Lista de Filmes</h1>
        <p>Carregando lista de filmes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-list-container">
        <h1>Lista de Filmes</h1>
        <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="movie-list-container">
      <h1>Lista de Filmes</h1>

      <div className="year-search">
        <input
          type="number"
          placeholder="Buscar por ano"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {filteredMovies.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ano</th>
              <th>Título</th>
              <th>Estúdio(s)</th>
              <th>Produtor(es)</th>
              <th>Vencedor</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.year}</td>
                <td>{movie.title}</td>
                <td>{movie.studios}</td>
                <td>{movie.producers}</td>
                <td>{movie.winner ? 'Sim' : 'Não'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum filme encontrado para o ano especificado ou nenhum filme carregado.</p>
      )}
    </div>
  );
};


function App() {
  // Estado para controlar qual página está ativa
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' ou 'movies'

  return (
    <div className="app-container">
      <nav className="navbar">
        <ul>
          <li>
            {/* Link para o Dashboard */}
            <a
              href="#"
              onClick={() => setCurrentPage('dashboard')}
              className={currentPage === 'dashboard' ? 'active' : ''}
            >
              Dashboard
            </a>
          </li>
          <li>
            {/* Link para a Lista de Filmes */}
            <a
              href="#"
              onClick={() => setCurrentPage('movies')}
              className={currentPage === 'movies' ? 'active' : ''}
            >
              Lista de Filmes
            </a>
          </li>
        </ul>
      </nav>

      <div className="content">
        {/* Renderização condicional baseada no estado currentPage */}
        {(() => {
          switch (currentPage) {
            case 'dashboard':
              return <Dashboard />;
            case 'movies':
              return <MovieList />;
            default:
              return <Dashboard />; // Fallback para o dashboard
          }
        })()}
      </div>
    </div>
  );
}

export default App;
