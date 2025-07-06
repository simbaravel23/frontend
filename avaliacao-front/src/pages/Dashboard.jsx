import React, { useState, useEffect } from 'react';
import {
  getYearsWithMultipleWinners,
  getStudiosWithWinCount,
  getMaxMinWinIntervalForProducers,
  getWinnersByYear
} from '../services/api';

const Dashboard = () => {
  const [yearsWithMultipleWinners, setYearsWithMultipleWinners] = useState([]);
  const [topStudios, setTopStudios] = useState([]);
  const [producersIntervals, setProducersIntervals] = useState({ min: [], max: [] });
  const [selectedYear, setSelectedYear] = useState('');
  const [winnersBySelectedYear, setWinnersBySelectedYear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          yearsRes,
          studiosRes,
          producersRes
        ] = await Promise.all([
          getYearsWithMultipleWinners(),
          getStudiosWithWinCount(),
          getMaxMinWinIntervalForProducers()
        ]);

        setYearsWithMultipleWinners(yearsRes.data.years || []);
        // Assegurar que 'studiosRes.data.studios' é um array antes de filtrar
        setTopStudios(Array.isArray(studiosRes.data.studios) ? studiosRes.data.studios.slice(0, 3) : []);
        setProducersIntervals(producersRes.data || { min: [], max: [] });
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados para o Dashboard:", err);
        setError("Não foi possível carregar os dados do Dashboard.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleYearSearch = async () => {
    if (selectedYear) {
      try {
        const response = await getWinnersByYear(selectedYear);
        setWinnersBySelectedYear(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar vencedores por ano:", err);
        setWinnersBySelectedYear([]); // Limpa se houver erro
      }
    } else {
      setWinnersBySelectedYear([]);
    }
  };

  if (loading) return <div>Carregando Dashboard...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <section className="dashboard-section">
        <h2>Anos com Mais de Um Vencedor</h2>
        {yearsWithMultipleWinners.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Ano</th>
                <th>Número de Vencedores</th>
              </tr>
            </thead>
            <tbody>
              {yearsWithMultipleWinners.map((item) => (
                <tr key={item.year}>
                  <td>{item.year}</td>
                  <td>{item.winnerCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum ano encontrado com múltiplos vencedores.</p>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Top 3 Estúdios com Mais Vitórias</h2>
        {topStudios.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Estúdio</th>
                <th>Contagem de Vitórias</th>
              </tr>
            </thead>
            <tbody>
              {topStudios.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.winCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum estúdio encontrado.</p>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Produtores com Maior e Menor Intervalo entre Vitórias</h2>
        <h3>Maior Intervalo</h3>
        {producersIntervals.max && producersIntervals.max.length > 0 ? (
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
              {producersIntervals.max.map((item, index) => (
                <tr key={`max-${index}`}>
                  <td>{item.producer}</td>
                  <td>{item.interval}</td>
                  <td>{item.previousWin}</td>
                  <td>{item.followingWin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum produtor encontrado com maior intervalo.</p>
        )}

        <h3>Menor Intervalo</h3>
        {producersIntervals.min && producersIntervals.min.length > 0 ? (
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
              {producersIntervals.min.map((item, index) => (
                <tr key={`min-${index}`}>
                  <td>{item.producer}</td>
                  <td>{item.interval}</td>
                  <td>{item.previousWin}</td>
                  <td>{item.followingWin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum produtor encontrado com menor intervalo.</p>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Vencedores de Determinado Ano</h2>
        <div className="year-search">
          <input
            type="number"
            placeholder="Digite o ano"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          />
          <button onClick={handleYearSearch}>Buscar</button>
        </div>
        {winnersBySelectedYear.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ano</th>
                <th>Título</th>
              </tr>
            </thead>
            <tbody>
              {winnersBySelectedYear.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>{movie.year}</td>
                  <td>{movie.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          selectedYear && <p>Nenhum vencedor encontrado para o ano {selectedYear}.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;