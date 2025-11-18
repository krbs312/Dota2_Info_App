import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import type { Match } from './store/store'
import { _PlayerStatisticDota2API_, _DotaAPIMap_, _LeftPanel_ } from './store/store'
import './App.css'
import { getAllMatches, loadAvatar, loadNickname, loadwinandloss } from './utils/GETAPI'
import { leftPanelConfig } from './conf/panelconf'
import { _Heroes_ } from './utils/heroes'
function App() {
  const [isLoading, setIsLoading] = useState(false)

  const leftPanel = _LeftPanel_
  const player = _PlayerStatisticDota2API_
  const playerid = '885760876'

    useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true)
      try {
        //await fetch(`https://api.opendota.com/api/players/${playerid}/refresh`, { method: 'POST' })
        const winLossData = await loadwinandloss(playerid)
        player.loadNickname(await loadNickname(playerid))
        player.setAvatar(await loadAvatar(playerid))
        const matches = await getAllMatches(playerid)
        player.setMatches(matches)
        player.setStats(winLossData.win, winLossData.loss, matches.map(m => m.result).join('').slice(0, 10))
      } catch (error) {
        console.error('Failed to fetch matches:', error)
        const fallback: Match[] = [
          { id: 1, result: 'W', hero: 'Juggerнаут', time: '2h' },
          { id: 2, result: 'L', hero: 'Пудж', time: '5h' }
        ]
        player.setMatches(fallback)
      } finally {
        setIsLoading(false)
      }
    }

    
    fetchMatches()
  }, [])

  const matches = (player.matches || []).slice(0, 5)

  return (
    <div className="app-grid">
      <aside className="sidebar">
        <h3>Вкладки</h3>
        <ul className="tabs">
          {leftPanelConfig.tabs.map(tab => (
            <li key={tab.id} className={leftPanel.activeTab === tab.id ? 'active' : ''} onClick={() => leftPanel.setActiveTab(tab.id)}>
              {tab.label}
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-panel">
        <div className="info-card">
          <div className='profileinfo'>
            <img src={player.avatar} className='avatar' />
            <div className="nickname">
              {player.nickname}
              <div className="stats">
                <div>Победы: <strong>{player.wins}</strong></div>
                <div>Поражения: <strong>{player.losses}</strong></div>
              </div>
            </div>
          </div>

          <div className="recent">
            <h4>Последние игры</h4>
            <div className="recent-text">{player.recent.split('').map((char, index) => (
              <span key={index} className={char === 'W' ? 'win' : 'loss'}>
                {char}
              </span>
            ))}</div>
          </div>
          <div className='mainheroes'>
            
          </div>

        </div>
      </main>


      <section className="right-column">
        <div className="news-card">
          <h4>Новости</h4>
          <p>Здесь будут отображаться последние новости и объявления (плейсхолдер).</p>
        </div>

        <div className="history-card">
          <h4>История игр</h4>
          {isLoading ? (
            <div className="loading">Загрузка игр...</div>
          ) : (
            <div className="matches">
              {matches.length === 0 && <div className="empty">Нет игр</div>}
              {player.latest(player.matchespage).map((m: Match) => (
                <div key={m.id} className="match-card">
                  <div className={`result ${m.result === 'W' ? 'win' : 'loss'}`}>
                    {m.result}
                  </div>
                  <div className="match-info">
                    <div className="hero">{m.hero}</div>
                    <div className="time">{m.time}</div>
                  </div>
                </div>
              ))}

              <div className="pagination">

                <button className='buttondotauiprev' onClick={() => player.matchesPage(false)}>
                  previous
                </button>

                <button className='buttondotauinext' onClick={() => player.matchesPage(true)}>
                  next
                </button>
              
              </div>
            </div>
            
          )}

        </div>
      </section>
    
    
    </div>
  )
}

export default observer(App)
