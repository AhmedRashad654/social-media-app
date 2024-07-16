import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
const SocketContext = createContext();
function SocketProvider({ children }) {
  const [socketValue, setSocketValue] = useState(null);
  const [onlineUser, setOnlineUser] = useState({});
  const user = useRecoilValue(userAtom);
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: {
        userId: user?._id,
      },
    });
    setSocketValue(socket);
    return () => socket && socket.close();
  }, [user?._id]);
  useEffect(() => {
    const handleGetOnlineUser = async (idOnline) => {
      setOnlineUser(Array.from(idOnline));
    };
    socketValue?.on("getOnlineUsers", handleGetOnlineUser);
    return () => {
      socketValue?.off("getOnlineUsers", handleGetOnlineUser);
    };
  }, [socketValue]);
  return (
    <SocketContext.Provider value={{ socketValue, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
}
export { SocketProvider, SocketContext };
SocketProvider.propTypes = {
  children: PropTypes.element,
};
