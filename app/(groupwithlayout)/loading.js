'use client';

import { RingLoader } from "react-spinners"
import { useState } from "react";

export default function Loading() {
    let [color, setColor] = useState("#000000"); //have to force it to run client side

    return (
        <div className="flex justify-center items-center h-screen">
            <RingLoader color={color} size={100} />
        </div>
    )
}
