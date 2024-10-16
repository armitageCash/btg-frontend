import React from "react";
import { Button, Statistic, Table } from "antd";
import type { TableProps } from "antd";
import { TransactionDetail } from "../types/index";

interface Props {
  datasource: TransactionDetail[]; // Propiedad para agregar transacciones
  isloading: boolean; // Propiedad para agregar transacciones
  onStatusChangeOrder: (tx: TransactionDetail) => void;
}

const columns: TableProps<TransactionDetail>["columns"] = [
  {
    title: "Nombres",
    dataIndex: ["subscription", "user", "firstName"], // Navega dentro del objeto para obtener el primer nombre
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Apellidos",
    dataIndex: ["subscription", "user", "lastName"], // Navega dentro del objeto para obtener el apellido
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Valor subscripción",
    className: "column-money",
    dataIndex: ["subscription", "fund", "minAmount"], // Accede al monto dentro de la suscripción
    align: "right",
    render(value, record, index) {
      return (
        <Statistic
          title="Valor de subscripción (COP)"
          value={value}
          precision={2}
        />
      );
    },
  },
  {
    title: "Inversión",
    className: "column-money",
    dataIndex: ["subscription", "amount"], // Accede al monto dentro de la suscripción
    align: "right",
    render(value, record, index) {
      return (
        <Statistic title="Valor invertido (COP)" value={value} precision={2} />
      );
    },
  },
  {
    title: "Rendimiento",
    dataIndex: "performance", // El performance viene directo de la transacción
    align: "right",
    render(value, record, index) {
      return <Statistic title="Ganancias (COP)" value={value} precision={2} />;
    },
  },
  {
    title: "Fecha",
    dataIndex: "date", // Muestra la fecha de la transacción
    render: (date) => new Date(date).toLocaleDateString(), // Formatea la fecha
  },
  {
    title: "Estado",
    dataIndex: "status",
    // Fo // Muestra el estado de la transacción
  },
];

const TransactionList: React.FC<Props> = ({
  datasource,
  isloading,
  onStatusChangeOrder,
}) => {
  columns[columns.length - 1].render = (status, value) => (
    <Button
      onClick={() => {
        onStatusChangeOrder(value);
      }}
      style={{ marginTop: 16 }}
      type={status === "Opened" ? "primary" : "default"}
    >
      {status === "Opened" ? "Orden Abierta" : "Orden Cerrada"}
    </Button>
  );
  return (
    <Table<TransactionDetail>
      loading={isloading}
      columns={columns}
      dataSource={datasource || []} // Asume que las transacciones ya están en el formato correcto
      rowKey={(record) => record._id} // Asegura que cada fila tenga una clave única
      bordered
      pagination={{
        pageSize: 4,
      }}
    />
  );
};

export default TransactionList;
