// import { } from "react-router-dom";
import { useParams } from "react-router-dom";
import styles from "./OrderView.module.css";

const OrderView = () => {
  const param = useParams();
  return <div>This is an Order {param.orderId}</div>;
};

export default OrderView;
