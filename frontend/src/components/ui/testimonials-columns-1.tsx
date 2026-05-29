"use client";

import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
    className?: string;
    testimonials: {
        text: string;
        image: string;
        name: string;
        role: string;
    }[];
    duration?: number;
}) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {props.testimonials.map(({ text, image, name, role }, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: "var(--surface)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "16px",
                                        padding: "28px",
                                        maxWidth: "320px",
                                        width: "100%",
                                        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = "var(--border-hover)";
                                        e.currentTarget.style.boxShadow =
                                            "var(--card-shadow-hover)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "var(--border)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "var(--text-secondary)",
                                            fontSize: "0.875rem",
                                            lineHeight: 1.65,
                                            marginBottom: "20px",
                                        }}
                                    >
                                        &ldquo;{text}&rdquo;
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        <img
                                            width={36}
                                            height={36}
                                            src={image}
                                            alt={name}
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "50%",
                                                border: "1px solid var(--border)",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: "0.8125rem",
                                                    fontWeight: 600,
                                                    color: "var(--text-white)",
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {name}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "var(--text-muted)",
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.div>
        </div>
    );
};
