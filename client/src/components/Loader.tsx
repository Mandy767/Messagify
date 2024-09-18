import { useState, useEffect } from 'react';

const PixelArtLoader = ({ size = 50, speed = 500 }) => {
    const [frame, setFrame] = useState(0);
    const pixelSize = Math.floor(size / 10);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((prevFrame) => (prevFrame + 1) % 4);
        }, speed);
        return () => clearInterval(interval);
    }, [speed]);

    const characterFrames = [
        // Frame 0: Normal
        [
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 3, 2, 2, 2, 2, 3, 2, 1],
            [1, 2, 3, 2, 2, 2, 2, 3, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 4, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [0, 1, 2, 2, 1, 1, 2, 2, 1, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]
        ],
        // Frame 1: Blink
        [
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 3, 3, 2, 2, 3, 3, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 4, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [0, 1, 2, 2, 1, 1, 2, 2, 1, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]
        ],
        // Frame 2: Normal (slightly up)
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 3, 2, 2, 2, 2, 3, 2, 1],
            [1, 2, 3, 2, 2, 2, 2, 3, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 4, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [0, 1, 2, 2, 1, 1, 2, 2, 1, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]
        ],
        // Frame 3: Blink (slightly up)
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 3, 3, 2, 2, 3, 3, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 4, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [0, 1, 2, 2, 1, 1, 2, 2, 1, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]
        ]
    ];

    const colors = {
        0: 'transparent',
        1: '#0099FF',
        2: '#66CCFF',
        3: '#000000',
        4: '#FFFFFF'
    };

    return (
        <div className="flex items-center justify-center bg-gray-100" style={{ width: "10px", height: "10px" }}>
            <div
                style={{
                    width: "10px",
                    height: "10px",
                    display: 'grid',
                    gridTemplateColumns: `repeat(10, ${pixelSize}px)`
                }}
            >
                {characterFrames[frame].flat().map((pixel, index) => (
                    <div
                        key={index}
                        style={{
                            width: `${pixelSize}px`,
                            height: `${pixelSize}px`,
                            // @ts-ignore
                            backgroundColor: colors[pixel]
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default PixelArtLoader;