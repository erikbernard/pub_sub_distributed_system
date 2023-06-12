import { useEffect, useState } from "react";
import WrapperMachine from './wrapperMachine';
import drinkMachine from "./assets/drink_machine.json";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const API = "http://localhost:3001/";
interface Prop {
  topic: string;
  off: boolean;
  speed: number;
  date: Date;
}
export default function App() {
  const [topic] = useState('Maquine_de_Suco');
  const [messages, setMessages] = useState<Prop[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(API + 'messages');
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
        } else {
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const interval = setInterval(fetchMessages, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSubmitTopic = async () => {
    try {
      const response = await fetch(API + 'subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (response.ok) {
        console.log('Message sent successfully!');
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    function simulateNetworkRequest() {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    }
    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
        handleSubmitTopic()
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleClick = () => setLoading(true);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  };

  const formatTime = (dateString: Date) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours || 12;
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  return (
    <div>
      <Alert variant="primary">
        <Alert.Heading>Projeto de Sistema Distribuido</Alert.Heading>
        <p>
          Criação de um projeto utilizando ZeroMQ e padrão Publisher/Subscriber
        </p>
      </Alert>
      <Container fluid>
        <Row>
          <Col>
            <WrapperMachine
              header={topic.replace("_", " ").replace("_", " ")}
              body='A máquina de suco conectada à IoT é um dispositivo que utiliza a tecnologia da Internet 
              das Coisas para fornecer uma experiência avançada de preparação de sucos. Com sensores e conectividade, 
              a máquina é capaz de monitorar ingredientes, ajustar automaticamente as proporções de frutas e líquidos, 
              criar receitas personalizadas, permitir o controle remoto por meio de aplicativos e fornecer dados em tempo 
              real sobre o processo de preparação. Essa máquina inovadora oferece conveniência, 
              personalização e insights valiosos para os amantes de sucos.'
              animationData={drinkMachine}
            />
          </Col>
          <Col>
            <Button
              style={{
                width: "-webkit-fill-available", margin: "1rem 4rem"
              }}
              variant="primary"
              disabled={isLoading}
              onClick={!isLoading ? handleClick : () => { "" }}
            >
              {isLoading ? 'Carregando…' : 'Listar dados'}
            </Button>
            {messages.length == 0 ?
              <Alert key="warning" variant="warning">
                Sem dados para lista no memomento!
              </Alert> :
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Machina</th>
                    <th>Status</th>
                    <th>Velocidade</th>
                    <th>Data da Alteração</th>
                    <th>Horário</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((item, index) => (
                    <tr key={index}>
                      <td>{item.topic.replace("_", " ").replace("_", " ")}</td>
                      <td>{item.off ? "Ligado" : "Desligado"}</td>
                      <td>{item.speed}</td>
                      <td>{formatDate(item.date)}</td>
                      <td>{formatTime(item.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            }
          </Col>
        </Row>
      </Container>

    </div >
  );
}