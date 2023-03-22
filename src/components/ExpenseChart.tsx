import React from "react";
import { Chart as ChartJS, defaults } from "chart.js";
import "chart.js/auto";
import { Doughnut, Pie } from "react-chartjs-2";
import { useState } from "react";
import { Colors } from "chart.js";
import { faChartPie, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { expenseChartProps } from "./types";

export default function ExpenseChart({ userExpenseList }: expenseChartProps) {
    const options = {
        plugins: {
            colors: {
                forceOverride: true,
            },
            legend: {
                labels: {
                    color: "black",
                    font: {
                        size: 18,
                        weight: "700",
                        fontFamily: "Poppins, sans-serif",
                    },
                },
            },
        },
        maintainAspectRatio: false,
    };
    console.log(userExpenseList);
    let test = userExpenseList.map((expense) => {
        console.log(expense);
        let amount = expense.expenseAmount;
        let frequency = expense.frequencyOfExpenseMonthly;
        let total = 0;
        if (frequency == "Monthly") {
            total = amount;
        } else if (frequency == "Bi-Weekly") {
            total = amount * 2;
        } else if (frequency == "Weekly") {
            total = amount * 4;
        } else if (frequency == "Daily") {
            total = amount * 30;
        }
        return total;
    });
    console.log(test);
    let chartData = {
        labels: userExpenseList.map((expense) => expense.nameOfExpense),
        datasets: [
            {
                label: "Expense",
                data: test,
                borderColor: "black",
                borderWidth: 2,
            },
        ],
    };
    const [chart, setChart] = useState("pie");
    console.log(chartData);
    return (
        <>
            <div>
                <div>
                    <button className="my-1 mx-1" onClick={() => setChart("pie")}>
                        <FontAwesomeIcon icon={faChartPie} />
                    </button>
                    <button className="my-1 mx-1" onClick={() => setChart("doughnut")}>
                        <FontAwesomeIcon icon={faSpinner} />
                    </button>
                </div>
                <div className="chart-background chart-sizing">{chart === "pie" ? <Pie data={chartData} options={options} /> : <Doughnut data={chartData} options={options} />}</div>
            </div>
        </>
    );
}
