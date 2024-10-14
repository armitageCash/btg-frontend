import React, { useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Layout,
  Menu,
  Modal,
  Row,
  Statistic,
  theme,
} from "antd";
import useFundsStore, { Fund } from "./hooks/useFundStore";
import FundsList from "./components/fundList";
import useUserStore from "./hooks/useUserStore";
import useStore from "./hooks";
import { Subscription } from "./hooks/useSubscriptionsStore";
import { notification } from "antd";
import useTransactions from "./hooks/useTransacctionStore";
import TransactionList from "./components/transactionList";

type NotificationType = "success" | "info" | "warning" | "error";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const { fetchFunds } = useFundsStore();
  const {
    transactions,
    fetchTransactions,
    isLoading: loadingTxs,
  } = useTransactions();

  const { subscribe } = useStore();
  const {
    user,
    fetchUser,
    isLoading: userLoader,
    error: errorUser,
  } = useUserStore();

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Nueva Orden",
      description: "Orden de inversión realizada correctamente",
    });
  };

  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedFund, setSelectedFund] = React.useState<string | null>(null);

  const handleConfirmTransaction = async (fund: Fund, values: any) => {
    if (!selectedFund) {
      return;
    }

    const newSubscription: Subscription = {
      fund: fund._id,
      user: user?._id,
      amount: values[fund.name],
      status: "Opened",
    };

    const tx = await subscribe(newSubscription);
    if (tx) {
      openNotificationWithIcon("success");
      fetchTransactions();
    }
  };

  useEffect(() => {
    fetchFunds();
    fetchUser();
    fetchTransactions();
  }, [fetchFunds, fetchUser]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      {contextHolder}
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={[
            {
              key: 1,
              label: `Subscripciones`,
            },
            {
              key: 2,
              label: `Trasacciones`,
            },
          ]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Fondos</Breadcrumb.Item>
          <Breadcrumb.Item>Assets</Breadcrumb.Item>
        </Breadcrumb>
        <h1>Transacciones</h1>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Row>
            <Col span={12}>
              <TransactionList
                onStatusChangeOrder={(tx) => {
                  Modal.confirm({
                    title: "Confirmar movimiento",
                    content: `¿Está seguro de que desea realizar este movimiento? de ${
                      tx.status == "Opened" ? "Cancelación" : ""
                    }`,
                    onOk: () => {},
                  });
                }}
                datasource={transactions}
                isloading={loadingTxs}
              />
            </Col>
            <Col span={12}>
              <h1 style={{ textAlign: "center" }}>Balance</h1>
              <div
                className="new-btn"
                style={{ width: "100%", textAlign: "center" }}
              >
                <Row gutter={16}>
                  <Col span={24}>
                    <Statistic
                      title="Account Balance (COP)"
                      value={112893}
                      precision={2}
                    />
                    <Button
                      onClick={() => setOpen(!open)}
                      style={{ marginTop: 16 }}
                      type="primary"
                    >
                      Nueva Apertura
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
      <Modal
        width={650}
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <FundsList
          onConfim={(fund, values) => {
            handleConfirmTransaction(fund, values);
          }}
          onSelectedFund={(fund) => setSelectedFund(fund._id)}
        />
      </Modal>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Andrew Castro
      </Footer>
    </Layout>
  );
};

export default App;
