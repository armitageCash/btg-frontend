import React, { useEffect } from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { TransactionDetail } from "../types/index";
import useTransactions from "../hooks/useTransacctionStore";

const columns: TableProps<TransactionDetail>["columns"] = [
  {
    title: "Nombres",
    dataIndex: ["subscription", "user", "firstName"], // Navega dentro del objeto para obtener el primer nombre
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Apellidos",
    dataIndex: ["subscription", "user", "lastName"], // Navega dentro del objeto para obtener el apellido
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Monto",
    className: "column-money",
    dataIndex: ["subscription", "amount"], // Accede al monto dentro de la suscripción
    align: "right",
  },
  {
    title: "Performance",
    dataIndex: "performance", // El performance viene directo de la transacción
    align: "right",
  },
  {
    title: "Fecha",
    dataIndex: "date", // Muestra la fecha de la transacción
    render: (date) => new Date(date).toLocaleDateString(), // Formatea la fecha
  },
  {
    title: "Estado",
    dataIndex: "status", // Muestra el estado de la transacción
  },
];

const TrasactionList: React.FC = () => {
  const { transactions, fetchTrasactions, isLoading, error } =
    useTransactions();

  useEffect(() => {
    fetchTrasactions();
  }, [fetchTrasactions]);

  return (
    <Table<TransactionDetail>
      loading={isLoading}
      columns={columns}
      dataSource={transactions} // Asume que las transacciones ya están en el formato correcto
      rowKey={(record) => record._id} // Asegura que cada fila tenga una clave única
      bordered
    />
  );
};

export default TrasactionList;
