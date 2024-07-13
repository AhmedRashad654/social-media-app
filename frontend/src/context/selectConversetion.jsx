import { useEffect } from "react";
import { createContext } from "react";
import PropTypes from "prop-types";
import { useRecoilState } from "recoil";
import { selectConverstion } from "../atoms/converstionAtom";
const SelectContext = createContext();

function SelectProvider({ children }) {
  const [select] = useRecoilState(selectConverstion);
  useEffect(() => {
    localStorage.setItem("selectConverstion", JSON.stringify(select));
  }, [select]);

  return <SelectContext.Provider value={{}}>{children}</SelectContext.Provider>;
}
export { SelectProvider };
SelectProvider.propTypes = {
  children: PropTypes.element,
};
