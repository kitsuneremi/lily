'use client'
import { motion } from 'framer-motion';

const borderVariants = {
    start: { borderColor: 'red' },
    toYellow: { borderColor: 'yellow' },
    toGreen: { borderColor: 'green' },
    toBlue: { borderColor: 'blue' },
    end: { borderColor: 'red' },
};

const borderTransition = {
    duration: 5,
    repeat: Infinity,
};

export default function Overlay() {
    return (
        <motion.div
            variants={borderVariants}
            initial="start"
            animate="end"
            transition={borderTransition}
            className="w-screen h-screen rgb rounded-lg p-4"
        >
            <div className='w-full h-full rounded-lg bg-white'>

            </div>
        </motion.div>
    )
}