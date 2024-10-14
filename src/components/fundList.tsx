import React, { useEffect, useState } from "react";
import useFundsStore, { Fund } from "../hooks/useFundStore";
import {
  List,
  Card,
  Statistic,
  Skeleton,
  InputNumber,
  Button,
  Modal,
} from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

interface Props {
  onSelectedFund: (fund: Fund) => void;
  onConfim: (fund: Fund, amount: { [key: string]: number }) => void;
}

const FundsList: React.FC<Props> = ({ onSelectedFund, onConfim }) => {
  const { funds, fetchFunds, isLoading, error } = useFundsStore();
  const [visibleInput, setVisibleInput] = useState<string | null>(null); // Almacenar el fondo seleccionado
  const [inputValues, setInputValues] = useState<{ [key: string]: number }>({}); // Almacenar valores de InputNumber

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleCardClick = (fund: Fund) => {
    // Solo mostrar el InputNumber del fondo seleccionado
    setVisibleInput(fund.name);
    onSelectedFund(fund); // Selección del fondo
  };

  const handleInputChange = (fundName: string, value: number | null) => {
    if (value !== null) {
      setInputValues((prev) => ({ ...prev, [fundName]: value })); // Guardar valor del InputNumber
    }
  };

  const handleConfirm = (fund: Fund) => {
    Modal.confirm({
      title: "Confirmar movimiento",
      content: `¿Está seguro de que desea realizar este movimiento por $${
        inputValues[fund.name]?.toLocaleString() || 0
      }?`,
      onOk: () => {
        // Aquí puedes realizar la acción de confirmar el movimiento
        console.log(
          `Movimiento confirmado para ${fund.name}: $${inputValues[fund.name]}`
        );
        setVisibleInput(null);
        onConfim(fund, inputValues);
        // Ocultar el campo después de confirmar
      },
    });
  };

  return (
    <div>
      <h2>Lista de Fondos</h2>
      <br />
      <Skeleton loading={isLoading}>
        <List
          grid={{ gutter: 24, column: 3 }}
          dataSource={funds}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.name}
                bordered={false}
                style={{ marginBottom: 10, cursor: "pointer" }}
                onClick={() => handleCardClick(item)} // Seleccionar fondo
              >
                <Statistic
                  title={item.category}
                  value={item.rate}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
                {/* Mostrar el InputNumber solo si está visible */}
                {visibleInput === item.name && (
                  <>
                    <p>Monto de inversión</p>
                    <InputNumber<number>
                      style={{ width: "100%" }}
                      defaultValue={item.minAmount}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) =>
                        value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                      }
                      onChange={(value) => handleInputChange(item.name, value)} // Manejar cambios
                    />
                    <Button
                      type="primary"
                      onClick={() => handleConfirm(item)}
                      style={{ marginTop: 10 }}
                    >
                      Confirmar
                    </Button>
                  </>
                )}
              </Card>
            </List.Item>
          )}
        />
      </Skeleton>
    </div>
  );
};

export default FundsList;
