import { createContext, useContext, useState } from "react";

const NavigationBlockContext = createContext();

export function NavigationBlockerProvider({ children }) {
  const [isBlocking, setIsBlocking] = useState(false);

  const shouldBlock = (nextPath) => {
    if (isBlocking) {
      return window.confirm("Tienes cambios sin guardar. ¿Estás seguro que quieres salir?");
    }
    return true;
  };

  return (
    <NavigationBlockContext.Provider value={{ isBlocking, setIsBlocking, shouldBlock }}>
      {children}
    </NavigationBlockContext.Provider>
  );
}

export const useNavigationBlock = () => useContext(NavigationBlockContext);
