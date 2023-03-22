import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { setLabels } from "react-chartjs-2/dist/utils";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, defaults } from "chart.js";
import Slider from "@mui/material/Slider";
import { Input } from "@mui/material";
import { futureValueProps } from "./types";

function FutureValue({ netIncome }: futureValueProps) {
    ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);
    const [timeScale, setTimeScale] = useState(30);
    const [labels, setLabels] = useState(() => {
        let yearsArr: number[] = [];
        for (let i = 1; i <= timeScale; i++) {
            yearsArr.push(i);
        }
        return yearsArr;
    });
    const [yearlyData, setYearlyData] = useState(() => {
        let yearlyDataArr: number[][] = [[], [], []];
        let start = netIncome;
        let yearsCompounded = labels.length;
        const COMPOUND_RATE = 12;
        const MONTHS_COMPOUNDED = 12;
        const MONTHLY_DEPOSIT = netIncome;
        for (let i = 0; i <= 2; i++) {
            let princ = start;
            let interestRate = 0.1;
            if (i === 1) {
                interestRate = 0.08;
            }
            if (i === 2) {
                interestRate = 0.12;
            }
            for (let year = 1; year <= yearsCompounded; year++) {
                for (let month = 1; month <= MONTHS_COMPOUNDED; month++) {
                    if (year === 1 && month === 1) {
                        princ += princ * (interestRate / COMPOUND_RATE);
                    } else {
                        princ += MONTHLY_DEPOSIT;
                        princ += princ * (interestRate / COMPOUND_RATE);
                    }
                }
                yearlyDataArr[i].push(princ);
            }
        }
        return yearlyDataArr;
    });

    const [lineChartData, setLineChartData] = useState({
        labels: labels,
        datasets: [
            {
                label: "Yearly estimated returns compounded by 10%",
                data: yearlyData[0],
            },
            {
                label: "Yearly estimated returns compounded by 8%",
                data: yearlyData[1],
            },
            {
                label: "Yearly estimated returns compounded by 12%",
                data: yearlyData[2],
            },
        ],
    });
    const options = {
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: `Expected Future Earning With Monthly Investment of Your $${netIncome}`,
                font: {
                    weight: "bold",
                    size: 30,
                },
            },
        },
        elements: {
            point: {
                borderWidth: 7,
                hoverRadius: 10,
            },
        },
    };

    useEffect(() => {
        setLabels(() => {
            let yearsArr: number[] = [];
            for (let i = 1; i <= timeScale; i++) {
                yearsArr.push(i);
            }
            return yearsArr;
        });
    }, [timeScale, netIncome]);
    useEffect(() => {
        setYearlyData(() => {
            let yearlyDataArr: number[][] = [[], [], []];
            let start = netIncome;
            let yearsCompounded = labels.length;
            const COMPOUND_RATE = 12;
            const MONTHS_COMPOUNDED = 12;
            const MONTHLY_DEPOSIT = netIncome;
            for (let i = 0; i <= 2; i++) {
                let princ = start;
                let interestRate = 0.1;
                if (i === 1) {
                    interestRate = 0.08;
                }
                if (i === 2) {
                    interestRate = 0.12;
                }
                for (let year = 1; year <= yearsCompounded; year++) {
                    for (let month = 1; month <= MONTHS_COMPOUNDED; month++) {
                        if (year === 1 && month === 1) {
                            princ += princ * (interestRate / COMPOUND_RATE);
                        } else {
                            princ += MONTHLY_DEPOSIT;
                            princ += princ * (interestRate / COMPOUND_RATE);
                        }
                    }
                    yearlyDataArr[i].push(princ);
                }
            }
            return yearlyDataArr;
        });
    }, [labels]);
    useEffect(() => {
        setLineChartData({
            labels: labels,
            datasets: [
                {
                    label: "Yearly estimated returns compounded by 10%",
                    data: yearlyData[0],
                },
                {
                    label: "Yearly estimated returns compounded by 8%",
                    data: yearlyData[1],
                },
                {
                    label: "Yearly estimated returns compounded by 12%",
                    data: yearlyData[2],
                },
            ],
        });
    }, [yearlyData]);
    console.log(lineChartData);
    return (
        <>
            <div className="chart-background">
                <div className="d-flex">
                    <p className="ms-3">Select Time Scale</p>
                    <Slider
                        sx={{ width: "50%", marginLeft: "5%", marginRight: "auto" }}
                        aria-label="Time-Scale"
                        value={timeScale}
                        valueLabelDisplay="auto"
                        step={5}
                        marks
                        min={5}
                        max={50}
                        onChangeCommitted={(e, value) => setTimeScale(value as number)}
                    />
                </div>

                <div>{lineChartData.datasets && options ? <Line data={lineChartData} options={options} /> : ""}</div>
            </div>
        </>
    );
}

export default FutureValue;
