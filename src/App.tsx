import React, { useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Menu,
  Modal,
  Row,
  Statistic,
  Layout,
  theme,
  Skeleton,
} from "antd";
import useFundsStore, { Fund } from "./hooks/useFundStore";
import FundsList from "./components/fundList";
import useUserStore from "./hooks/useUserStore";
import useStore from "./hooks";
import useSubscriptionStore, {
  Subscription,
} from "./hooks/useSubscriptionsStore";
import { notification } from "antd";
import useTransactions from "./hooks/useTransacctionStore";
import TransactionList from "./components/transactionList";
import { Avatar, Dropdown, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const UserMenu = (
  <Menu>
    <Menu.Item key="profile" icon={<UserOutlined />}>
      Perfil
    </Menu.Item>
    <Menu.Item key="settings" icon={<SettingOutlined />}>
      Configuración
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout" icon={<LogoutOutlined />}>
      Cerrar sesión
    </Menu.Item>
  </Menu>
);

type NotificationType = "success" | "info" | "warning" | "error";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const { fetchFunds } = useFundsStore();
  const { updateSubscriptions } = useSubscriptionStore();

  const {
    transactions,
    fetchTransactions,
    isLoading: loadingTxs,
  } = useTransactions();

  const { subscribe } = useStore();
  const { user, fetchUser, isLoading: userLoader } = useUserStore();

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    title: string,
    message: String
  ) => {
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
      amount: values[fund.name] ?? fund.minAmount,
      status: "Opened",
    };

    const tx = await subscribe(newSubscription);
    if (tx) {
      openNotificationWithIcon(
        "success",
        "Nueva Orden",
        "Orden de inversión realizada correctamente"
      );
      fetchTransactions();
      fetchUser();
    }
  };

  useEffect(() => {
    fetchFunds();
    fetchUser();
    fetchTransactions();
  }, [fetchFunds, fetchTransactions, fetchUser]);

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
              key: 2,
              label: `Trasacciones`,
            },
          ]}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Dropdown overlay={UserMenu} trigger={["click"]}>
          <Space>
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
            />
            <span style={{ color: "white" }}>{user?.firstName}</span>
          </Space>
        </Dropdown>
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Fondos</Breadcrumb.Item>
          <Breadcrumb.Item>Assets</Breadcrumb.Item>
        </Breadcrumb>
        <h1>Transacciones</h1>
        <Row gutter={8}>
          <Col span={20}>
            <div
              style={{
                background: colorBgContainer,
                minHeight: 280,
                padding: 24,
                borderRadius: borderRadiusLG,
              }}
            >
              <TransactionList
                onStatusChangeOrder={(tx) => {
                  if (tx.subscription.status === "Closed") {
                    return Modal.confirm({
                      cancelButtonProps: { style: { display: "none" } },
                      title: "Orden Cancelada!",
                      content: `No puedes cerrar una orden previamente cerrada.`,
                      onOk: async () => {
                        return;
                      },
                    });
                  }

                  Modal.confirm({
                    title: "Confirmar movimiento",
                    content: `¿Está seguro de que desea realizar este movimiento? de ${
                      tx.status === "Opened" ? "Cancelación" : ""
                    }`,
                    onOk: async () => {
                      await updateSubscriptions(tx.subscription);
                      openNotificationWithIcon(
                        "success",
                        "Orden de cancelación",
                        "Orden cancelada correctamente"
                      );
                      fetchTransactions();
                      fetchUser();
                    },
                  });
                }}
                datasource={transactions}
                isloading={loadingTxs}
              />
            </div>
          </Col>
          <Col span={4}>
            <div
              style={{
                background: colorBgContainer,
                minHeight: 280,
                padding: 24,
                borderRadius: borderRadiusLG,
              }}
            >
              <div style={{ padding: 20 }}>
                <h1 style={{ textAlign: "center" }}>Balance</h1>
                <div
                  className="new-btn"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  <Row gutter={16}>
                    <Col span={24}>
                      {userLoader ? (
                        <Skeleton />
                      ) : (
                        <>
                          {" "}
                          <Statistic
                            title="Account Balance (COP)"
                            value={user?.wallet.balance}
                            precision={2}
                          />
                          <Button
                            onClick={() => setOpen(!open)}
                            style={{ marginTop: 16 }}
                            type="primary"
                          >
                            Nueva Apertura
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
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
