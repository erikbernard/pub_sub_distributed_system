import { useRef, useState, useEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import Form from 'react-bootstrap/Form';

const API = "http://localhost:3001/";

import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
interface PropsWrapperMachine {
  animationData: unknown;
  header: string;
  body: string;
}

export default function WrapperMachine({ animationData, header, body }: PropsWrapperMachine) {
  const animationRef = useRef<LottieRefCurrentProps>(null);

  const [checked, setChecked] = useState(true);
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const intervalref = useRef<number | null>(null);


  const startIntervalIncrement = (speed: number) => {
    if (intervalref.current !== null) return;
    intervalref.current = window.setInterval(() => {
      speed++;
      changeSpeed(speed);
      if (speed == selectedSpeed) {
        stopInterval();
      }
    }, 500);
  };

  const startIntervalDecrement = (speed: number) => {
    if (intervalref.current !== null) return;
    intervalref.current = window.setInterval(() => {
      speed--;
      changeSpeed(speed);
    }, 500);
  };

  const stopInterval = () => {
    if (intervalref.current) {
      window.clearInterval(intervalref.current);
      intervalref.current = null;
    }
  };

  const handleSpeedChange = (selectedValue: string) => {
    if (selectedValue.length < 2) {
      setSelectedSpeed(parseInt(selectedValue));
    }
  };

  const changeSpeed = (speed: number) => {
    if (animationRef.current) {
      if (speed > 0) {
        animationRef.current.setSpeed(speed);
      }
      if (speed == 0) {
        animationRef.current.pause();
        stopInterval();
      }
    }
  };

  const slowDownAnimation = () => {
    if (animationRef.current) {
      startIntervalDecrement(selectedSpeed);
    }
  };

  const speedUpAnimation = () => {
    if (animationRef.current) {
      animationRef.current.play();
      startIntervalIncrement(0);

    }
  };

  useEffect(() => {
    if (checked) {
      slowDownAnimation();
    } else {
      speedUpAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  useEffect(() => {
    changeSpeed(selectedSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSpeed]);


  const handleSubmitPublish = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      const response = await fetch(API + 'publish ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: header.replace(" ", "_").replace(" ", "_"),
          speed: selectedSpeed,
          off: !checked,
        }),
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

  return (
    <div
      style={{
        margin: ".5rem"
      }}>
      <Card>
        <Card.Header>{header}</Card.Header>
        <Card.Body>
          <Lottie
            animationData={animationData}
            lottieRef={animationRef}
            loop
            autoplay
          />
          <Card.Text style={{
            margin: "1rem 0"
          }} >{body}</Card.Text>
        </Card.Body>
        <Card.Footer>
          {"Controler da " + header}
          <Form onSubmit={handleSubmitPublish}>
            <Form.Check
              type="switch"
              id="Desligar"
              label="Desligar"
              disabled={checked}
              isInvalid={checked}
              checked={checked}
              onChange={() => setChecked(!checked)}

            />
            <Form.Check
              type="switch"
              id="Ligar"
              checked={!checked}
              isValid={!checked}
              label="Ligar"
              disabled={!checked}
              onChange={() => setChecked(!checked)}

            />

            <Form.Select
              disabled={checked}
              aria-label="Selecionar velocidade"
              value={selectedSpeed}
              onChange={(event) => handleSpeedChange(event.target.value)}>
              <option>Selecionar velocidade</option>
              {[...Array(9)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </Form.Select>
            <Button style={{
              margin: ".5rem 0"
            }} type='submit' variant="outline-success">Atualizar</Button>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
}