import React, {useState, useEffect} from "react";
import Modal from 'react-modal';

const cells = Array(10).fill(Array(10).fill(""));
const DIRECTIONS = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const getInitialFood = () => Array.from({length: 2}, () => Math.floor(Math.random() * 10));
const getInitialObstacle = () => Array.from ({length:10 }, () => Array.from({length: 2}, () => Math.floor(Math.random()*10)));
const initialDirection = DIRECTIONS.right;
const initialSnake = [[2, 1], [1, 1], [0, 1]];
const initialModal = false;
const initialTimer = 500;

function App() {
    const [food, setFood] = useState(getInitialFood());
    const [snake, setSnake] = useState(initialSnake);
    const [obstacle, setObstacle] = useState(changeObstacle);
    const [direction, setDirection] = useState(initialDirection);
    const [modalIsOpen, setIsOpen] = React.useState(initialModal);
    const [timer, setTimer] = React.useState(initialTimer);

    function resetState(){
        setSnake(initialSnake);
        setTimer(initialTimer);
        setObstacle(changeObstacle());
        setFood(getInitialFood());
        setDirection(initialDirection);
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        resetState();
    }

    function gameOver(){
        openModal();
        setTimer(0);
    }

    function testIfLost(newHead){
        return (newHead[1]>9||newHead[1]<0)||obstacle.some(elem => elem[0] === newHead[0] && elem[1] === newHead[1])||snake.some(elem => elem[0] === newHead[0] && elem[1] === newHead[1]);
    }

    function testIfAte(newHead){
        return (food[0] === newHead[0] && food[1] === newHead[1]);
    }
    function moveSnake() {
        let newHead = [direction[0] + snake[0][0], direction[1] + snake[0][1]];
        if (newHead[0]>9) newHead[0] = 0;
        if (newHead[0]<0) newHead[0] = 9;
        testIfAte(newHead) ? changeFood() : snake.pop();
        if (testIfLost(newHead)) gameOver();
        snake.unshift(newHead);
        let newSnake = [...snake];
        setSnake(newSnake);
    }


    function keyHandler (event){
        const callback = {
            "ArrowUp": () => setDirection(DIRECTIONS.up),
            "ArrowDown": () => setDirection(DIRECTIONS.down),
            "ArrowLeft": () => setDirection(DIRECTIONS.left),
            "ArrowRight": () => setDirection(DIRECTIONS.right),
        }[event.key];
        callback?.()
    }

    function checkFood(newFood){
        return obstacle.some(elem => elem[0] === newFood[0] && elem[1] === newFood[1])
    }

    function changeFood(){
        let newFood;
        do {
            newFood = getInitialFood();
        }
        while (checkFood(newFood));
        setFood(newFood);
        let newTimer = timer - 10;
        setTimer(newTimer);

    }

    function checkObstacle(newObstacle){
        return newObstacle.some(elem => elem[1] === 1);
    }

    function changeObstacle(){
        let newObstacle;
        do {
            newObstacle = getInitialObstacle();
        }
        while (checkObstacle(newObstacle));
        return newObstacle;
    }

    function cellColor(indexX, indexY){
        if (snake.some(elem => elem[0] === indexX && elem[1] === indexY)) return "red"
        if (obstacle.some(elem => elem[0] === indexX && elem[1] === indexY)) return "black"
        if (food[0] === indexX && food[1] === indexY) return "green"
        return "white";
    }

    useEffect(() => {
        window.addEventListener("keydown", (e) => {keyHandler(e)});
        let gameInterval;
        if (timer!=0) {
            gameInterval = setInterval(() => {
                moveSnake();
            }, timer);
        }
        return () => {
            clearInterval(gameInterval);
            window.removeEventListener("keydown", (e) => {keyHandler(e)});
        }
    }, [direction, timer]);

    useEffect(() => {
        changeFood();
        console.log(food)
    }, [])
    return (
        <div className="App" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"

        }}>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                style={customStyles}
            >

                <div>Game over </div>
                <button onClick={closeModal}>Restart</button>
            </Modal>
            <div>
                {cells.map((row, indexY) =>
                    <div key={indexY} style={{display: "flex"}}>
                        {row.map((cell, indexX) =>
                            <div key={indexX}
                                 style={{
                                     width: "40px",
                                     height: "40px",
                                     border: "black 1px solid",
                                     margin: "2px",
                                     backgroundColor: cellColor(indexX, indexY)
                                 }}>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

  );

}

export default App;
