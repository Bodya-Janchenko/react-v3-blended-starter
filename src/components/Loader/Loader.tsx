import style from "./Loader.module.css";
import { SpinnerCircularSplit } from "spinners-react";

export default function Loader() {
  return (
    <div className={style.backdrop}>
      <SpinnerCircularSplit
        size={50}
        thickness={100}
        speed={100}
        color="#36ad47"
        secondaryColor="rgba(0, 0, 0, 0.44)"
      />
    </div>
  );
}
