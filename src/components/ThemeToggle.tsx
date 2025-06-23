// src/components/ThemeToggle.tsx
import React, { useState, useEffect } from 'react';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  // Sempre inicia em modo escuro (dark mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Sempre retorna true para iniciar em dark mode
    return true;
  });

  // Aplica o tema escuro imediatamente ao montar o componente
  useEffect(() => {
    // Força o dark mode na inicialização
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }, []); // Executa apenas uma vez na montagem

  // Aplica o tema quando o tema muda
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Troca o tema
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`theme-toggle ${className}`}>
      <input
        type="checkbox"
        id="theme-toggle"
        className="theme-toggle-checkbox"
        checked={isDarkMode}
        onChange={toggleTheme}
      />
      <label htmlFor="theme-toggle" className="theme-toggle-label">
        <span className="sun">☀️</span>
        <span className="moon">🌙</span>
        <span className="theme-toggle-switch"></span>
      </label>
    </div>
  );
};

export default ThemeToggle;