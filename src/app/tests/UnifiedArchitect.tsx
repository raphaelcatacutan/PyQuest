import React, { useState } from 'react';
import BossArchitect from './BossArchitect';
import EnemyArchitect from './EnemyArchitect';
import ConsumableArchitect from './ConsumableArchitect';
import ArmorArchitect from './ArmorArchitect';
import WeaponArchitect from './WeaponArchitect';
import DungeonArchitect from './DungeonArchitect';
import TrialsArchitect from './TrialsArchitect';

type ArchitectType = 'boss' | 'enemy' | 'consumable' | 'armor' | 'weapon' | 'dungeon' | 'trials';

export default function UnifiedArchitect() {
  const [activeTab, setActiveTab] = useState<ArchitectType>('boss');

  const tabs: { id: ArchitectType; label: string; color: string }[] = [
    { id: 'boss', label: 'Boss', color: '#ffcc00' },
    { id: 'enemy', label: 'Enemy', color: '#00ff88' },
    { id: 'consumable', label: 'Consumable', color: '#00d4ff' },
    { id: 'armor', label: 'Armor', color: '#00d4ff' },
    { id: 'weapon', label: 'Weapon', color: '#00d4ff' },
    { id: 'dungeon', label: 'Dungeon', color: '#ff9d00' },
    { id: 'trials', label: 'Trials', color: '#ff6b9d' },
  ];

  const renderArchitect = () => {
    switch (activeTab) {
      case 'boss':
        return <BossArchitect />;
      case 'enemy':
        return <EnemyArchitect />;
      case 'consumable':
        return <ConsumableArchitect />;
      case 'armor':
        return <ArmorArchitect />;
      case 'weapon':
        return <WeaponArchitect />;
      case 'dungeon':
        return <DungeonArchitect />;
      case 'trials':
        return <TrialsArchitect />;
      default:
        return <BossArchitect />;
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Header with tabs */}
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>Item Architect Suite</h1>
        <div style={styles.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? { ...styles.tabActive, borderBottomColor: tab.color } : {}),
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div style={styles.content}>
        {renderArchitect()}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    backgroundColor: '#080808',
    color: '#ccc',
    fontFamily: 'monospace',
  },
  header: {
    backgroundColor: '#0a0a0a',
    borderBottom: '1px solid #222',
    padding: '20px 30px',
  },
  mainTitle: {
    color: '#fff',
    fontSize: '24px',
    margin: '0 0 15px 0',
    fontWeight: 'bold',
  },
  tabBar: {
    display: 'flex',
    gap: '5px',
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: '#111',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#888',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderBottomColor: '#ffcc00',
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
};
