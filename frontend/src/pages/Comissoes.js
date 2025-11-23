import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Comissoes.css'; // Import the new CSS file
import {supabase }  from '../util/supabase';

/**
 * @typedef {object} Card
 * @property {number} id
 * @property {string} sigla
 * @property {string} comissao
 * @property {string[]} presidente
 * @property {string[][]} membro
 */



const useScreenOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(
    window.matchMedia('(orientation: portrait)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: portrait)');
    const handleOrientationChange = (e) => setIsPortrait(e.matches);

    mediaQuery.addEventListener('change', handleOrientationChange);

    return () => {
      mediaQuery.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  return isPortrait;
};




function Comissoes() {
  const [currentCard, setCurrentCard] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const isPortrait = useScreenOrientation(); // Use the orientation hook
  const [ctpData, setCtpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const fetchCtpData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('ctp')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      
      setCtpData(data || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados ao montar o componente
  useEffect(() => {
    fetchCtpData();
  }, []);

  /** @type {Card[]} */
  const cards = Array.from({ length: 21 }, (_, i) => {
    const cardNumber = i + 1;

    const siglas = [
      'CA', 'CCTES', 'CCJR', 'CCE', 'CDC', 'CDDM', 'CDS', 'CDRRHMP ', 'CDHC',
      'CEB', 'CFC', 'CIDEC', 'CIA', 'CJUV ', 'CMADS ', 'COFT', 'CPSS ',
      'CPSCF', 'CTASP', 'CTS', 'CVTDU'
    ];

    const comissoes = [
      'Agropecuária', 'Ciência, Tecnologia e Educação Superior', 'Constituição, Justiça e Redação',
      'Cultura e Esportes', 'Defesa do Consumidor', 'Defesa e Direitos da Mulher', 'Defesa Social',
      'Desenv. Regional, Recursos Hídricos, Minas e Pesca', 'Direitos Humanos e Cidadania',
      'Educação Básica', 'Fiscalização e Controle', 'Indústria, Desenvolvimento Econômico e Comércio',
      'Infância e Adolescência', 'Juventude', 'Meio Ambiente, Mudanças Clim. e Desenv. do Semiárido',
      'Orçamento, Finanças e Tributação', 'Previdência Social e Saúde', 'Proteção Social e Combate à Fome',
      'Trabalho, Administração e Serviço Público', 'Turismo e Serviços', 'Viação, Transporte, Desenvolvimento Urbano'
    ];

    const presidentes = [
      ['Missias Dias, PT', 'Bruno Pedrosa, PT'], ['Cláudio Pinho, PDT', 'Queiroz Filho, PDT'],
      ['Salmito, PSB', 'Marcos Sobreira, PSB'], ['Emilia Pessoa, PSDB', 'Luana Régia, Cidadania'],
      ['Fernando Hugo, PSD', 'Simão Pedro, PSD'], ['Juliana Lucena, PT', 'Missias Dias, PT'],
      ['Leonardo Pinheiro, Progressistas', 'Júlio César Filho, PT'], ['Stuart Castro, Avante', 'Missias Dias, PT'],
      ['Renato Roseno, Psol', 'Nizo Costa, PT'], ['Marcos Sobreira, PSB', 'Guilherme Landim, PSB'],
      ['Agenor Neto, MDB', 'Davi de Raimundão, MDB'], ['Firmo Camurça, União', 'Heitor Férrer, União'],
      ['Luana Régia, Cidadania', 'Emilia Pessoa, PSDB'], ['Antônio Henrique, PDT', 'Lucinildo Frota, PDT'],
      ['Bruno Pedrosa, PT', 'Missias Dias, PT'], ['Sérgio Aguiar, PSB', 'Guilherme Landim, PSB'],
      ['Alysson Aguiar, PCdoB', 'Missias Dias, PT'], ['Guilherme Landim, PSB', 'Marcos Sobreira, PSB'],
      ['Júlio César Filho, PT', 'Nizo Costa, PT'], ['Marta Gonçalves, PSB', 'Luana Régia, Cidadania'],
      ['Lucinildo Frota, PDT', 'Queiroz Filho, PDT']
    ];

    const vice_presidentes = [
      ['Agenor Neto, MDB', 'Davi de Raimundão, MDB'], ['Emilia Pessoa, PSDB', 'Marcos Sobreira, PSB'],
      ['Missias Dias, PT', 'Alysson Aguiar, PCdoB'], ['Bruno Pedrosa, PT', 'Missias Dias, PT'],
      ['Guilherme Landim, PSB', 'Luana Régia, Cidadania'], ['Jô Farias, PT', 'Nizo Costa, PT'],
      ['Agenor Neto, MDB', 'Davi de Raimundão, MDB'], ['Guilherme Landim, PSB', 'Sérgio Aguiar, PSB'],
      ['Missias Dias, PT', 'Alysson Aguiar, PCdoB'], ['Jô Farias, PT', 'Júlio César Filho, PT'],
      ['Leonardo Pinheiro, Progressistas', 'Almir Bié, Progressistas'], ['Sérgio Aguiar, PSB', 'Guilherme Bismarck, PSB'],
      ['Jô Farias, PT', 'Guilherme Sampaio, PT'], ['Davi de Raimundão, MDB', 'Agenor Neto, MDB'],
      ['Stuart Castro, Avante', 'Guilherme Sampaio, PT'], ['Missias Dias, PT', 'Jô Farias, PT'],
      ['Guilherme Landim, PSB', 'Marcos Sobreira, PSB'], ['Missias Dias, PT', 'Nizo Costa, PT'],
      ['Guilherme Landim, PSB', 'Sérgio Aguiar, PSB'], ['Júlio César Filho, PT', 'Missias Dias, PT'],
      ['Bruno Pedrosa, PT', 'Missias Dias, PT']
    ];

    const membros = [
        [['Simão Pedro, PSD', 'Lucílvio Girão, PSD'],['Salmito, PSB', 'Guilherme Bismarck, PSB'],['Queiroz Filho, PDT', 'Antônio Henrique, PDT'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Guilherme Sampaio, PT', 'Jô Farias, PT'],['Agenor Neto, MDB', 'Davi de Raimundão, MDB'],['Alysson Aguiar, PCdoB', 'Missias Dias, PT'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x_x', 'x,x']],
        [['Guilherme Sampaio, PT', 'Jô Farias, PT'],['Júlio César Filho, PT', 'Nizo Costa, PT'],['Antonio Granja, PSB', 'Guilherme Landim, PSB'],['Sargento Reginauro, União', 'Heitor Férrer, União'],['Queiroz Filho, PDT', 'Antônio Henrique, PDT'],['Agenor Neto, MDB', 'Davi de Raimundão, MDB'],['Carmelo Bolsonaro, PL', 'Dra. Silvana, PL']],
        [['Almir Bié, Progressistas', 'Leonardo Pinheiro, Progressistas'],['Guilherme Sampaio, PT', 'Nizo Costa, PT'],['Guilherme Bismarck, PSB', 'Marcos Sobreira, PSB'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Jô Farias, PT', 'Missias Dias, PT'],['Nizo Costa, PT', 'Júlio César Filho, PT'],['Marcos Sobreira, PSB', 'Guilherme Bismarck, PSB'],['Alysson Aguiar, PCdoB', 'Guilherme Sampaio, PT'],['Lucinildo Frota, PDT', 'Queiroz Filho, PDT'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Emilia Pessoa, PSDB', 'Marcos Sobreira, PSB'],['Marta Gonçalves, PSB', 'Guilherme Bismarck, PSB'],['Luana Régia, Cidadania', 'Salmito, PSB'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Missias Dias, PT', 'Guilherme Sampaio, PT'],['Luana Régia, Cidadania', 'Marta Gonçalves, PSB'],['Sargento Reginauro, União', 'Heitor Férrer, União'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Bruno Pedrosa, PT', 'Guilherme Sampaio, PT'],['Leonardo Pinheiro, Progressistas', 'Almir Bié, Progressistas'],['Antônio Henrique, PDT', 'Queiroz Filho, PDT'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Guilherme Sampaio, PT', 'Júlio César Filho, PT'],['Marcos Sobreira, PSB', 'Marta Gonçalves, PSB'],['Claúdio Pinho, PDT', 'Queiroz Filho, PDT'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Guilherme Sampaio, PT', 'Alysson Aguiar, PCdoB'],['Queiroz Filho, PDT', 'Antônio Henrique, PDT'],['David Durand, Republicanos', 'Missias Dias, PT'],['Juliana Lucena, PT', 'Nizo Costa, PT'],['Salmito, PSB', 'Emilia Pessoa, PSDB'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Nizo Costa, PT', 'Júlio César Filho, PT'],['Stuart Castro, Avante', 'Jô Farias, PT'],['Guilherme Sampaio, PT', 'Alysson Aguiar, PCdoB'],['Missias Dias, PT', 'Juliana Lucena, PT'],['Guilherme Bismarck, PSB', 'Marcos Sobreira, PSB'],['Sérgio Aguiar, PSB', 'Salmito, PSB'],['Cláudio Pinho, PDT', 'Queiroz Filho, PDT']],
        [['Salmito, PSB', 'Marcos Sobreira, PSB'],['Bruno Pedrosa, PT', 'Nizo Costa, PT'],['Almir Bié, Progressistas', 'Leonardo Pinheiro, Progressistas'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Juliana Lucena, PT', 'Júlio César Filho, PT'],['Alysson Aguiar, PCdoB', 'Nizo Costa, PT'],['Queiroz Filho, PDT', 'Antônio Henrique, PDT'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Juliana Lucena, PT', 'Jô Farias, PT'],['Guilherme Bismarck, PSB', 'Emilia Pessoa, PSDB'],['Bruno Pedrosa, PT', 'Júlio César Filho, PT'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Agenor Neto, MDB', 'Davi de Raimundão, MDB'],['Renato Roseno, Psol', 'Simão Pedro, PSD'],['Guilherme Bismarck, PSB', 'Sérgio Aguiar, PSB'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Guilherme Sampaio, PT', 'Alysson Aguiar, PCdoB'],['Júlio César Filho, PT', 'Nizo Costa, PT'],['Lucinildo Frota, PDT', 'Cláudio Pinho, PDT'],['Tin Gomes, PSB', 'Marcos Sobreira, PSB'],['Antônio Henrique, PDT', 'Queiroz Filho, PDT'],['Agenor Neto, MDB', 'Davi de Raimundão, MDB'],['Dra. Silvana, PL', 'Alcides Fernandes, PL']],
        [['Heitor Férrer, União', 'Firmo Camurça, União'],['Dra. Silvana, PL', 'Alcides Fernandes, PL'],['Guilherme Sampaio, PT', 'Nizo Costa, PT'],['Lucílvio Girão, PSD', 'Fernando Hugo, PSD'],['Leonardo Pinheiro, Progressistas', 'Jô Farias, PT'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Jô Farias, PT', 'Guilherme Sampaio, PT'],['Simão Pedro, PSD', 'Alysson Aguiar, PCdoB'],['Renato Roseno, Psol', 'Luana Régia, Cidadania'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Guilherme Sampaio, PT', 'Alysson Aguiar, PCdoB'],['Missias Dias, PT', 'Stuart Castro, Avante'],['Tin Gomes, PSB', 'Marcos Sobreira, PSB'],['Agenor Neto, MDB', 'Davi de Raimundão, MDB'],['Leonardo Pinheiro, Progressistas', 'Almir Bié, Progressistas'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Guilherme Bismarck, PSB', 'Marcos Sobreira, PSB'],['Lucinildo Frota, PDT', 'Antônio Henrique, PDT'],['Sérgio Aguiar, PSB', 'Emilia Pessoa, PSDB'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']],
        [['Nizo Costa, PT', 'Guilherme Sampaio, PT'],['Júlio César Filho, PT', 'Stuart Castro, Avante'],['Marta Gonçalves, PSB', 'Guilherme Bismarck, PSB'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x'],['x,x', 'x,x']]
    ];

    return {
      id: cardNumber, sigla: siglas[i], comissao: comissoes[i], presidente: presidentes[i],
      vice_presidente: vice_presidentes[i], membro: membros[i]
    };
  });

  useEffect(() => {
    document.querySelectorAll('*').forEach((el) => {
      if (el.textContent === 'x' || el.innerHTML === 'x') {
        el.classList.add('branco');
      }
      else{
        ctpData.map(item => {
          if ((el.textContent === item.deputado || el.innerHTML === item.deputado) && item.licenciado) {
            el.classList.add("licenciado");
          }
        });
      }
    });
  });

  const nextCard = useCallback(() => {
    setCurrentCard((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const previousCard = useCallback(() => {
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const goToCard = (index) => setCurrentCard(index);

  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const currentX = e.targetTouches[0].clientX;
    setTouchEndX(currentX);
    if (touchStartX !== null) {
      const progress = currentX - touchStartX;
      setSwipeProgress(progress);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchEndX - touchStartX;
    const threshold = 50;

    if (distance < -threshold) nextCard();
    else if (distance > threshold) previousCard();
    
    setSwipeProgress(0);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight') nextCard();
      else if (event.key === 'ArrowLeft') previousCard();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextCard, previousCard]);

  const currentCardData = cards[currentCard];

  return (
    <>
        <div
          className="card-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            key={currentCard}
            className="card"
            style={{ 
              transform: `translateX(${swipeProgress}px)`, 
              transition: swipeProgress === 0 ? 'transform 0.3s ease-out' : 'none' 
            }}
          >
            <div className="card-header">
              <h2 className="card-title">
                {isPortrait ? currentCardData.sigla : currentCardData.comissao}
              </h2>
            </div>
            <table className="card-table">
              <thead>
                <tr>
                  <th className='col-label'>Titular</th>
                  <th className='col-label'>Suplente</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={2} className='section-title'>Presidente</td></tr>
                <tr>
                  <td className='dep'>{(currentCardData.presidente && currentCardData.presidente[0])?.substring(0, currentCardData.presidente[0].indexOf(',')) || ''}</td>
                  <td className='dep'>{(currentCardData.presidente && currentCardData.presidente[1])?.substring(0, currentCardData.presidente[1].indexOf(',')) || ''}</td>
                </tr>
                <tr><td colSpan={2} className='section-title'>Vice-Presidente</td></tr>
                <tr>
                  <td className='dep'>{(currentCardData.vice_presidente && currentCardData.vice_presidente[0])?.substring(0, currentCardData.vice_presidente[0].indexOf(',')) || ''}</td>
                  <td className='dep'>{(currentCardData.vice_presidente && currentCardData.vice_presidente[1])?.substring(0, currentCardData.vice_presidente[1].indexOf(',')) || ''}</td>
                </tr>
                <tr><td colSpan={2} className='section-title'>Membros</td></tr>
                {currentCardData.membro.map((m, index) => (
                  <tr key={index}>
                    <td className='dep'>{(m && m[0])?.substring(0, m[0].indexOf(',')) || ''}</td>
                    <td className='dep'>{(m && m[1])?.substring(0, m[1].indexOf(',')) || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      

      <nav className="pagination">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => goToCard(index)}
            className={`dot ${index === currentCard ? 'active' : ''}`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </nav>
    </>
  );
}

export default Comissoes;
