import { Box, Modal, TextField, Button } from "@mui/material";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import ExpenseChart from "./components/ExpenseChart";
import ExpenseInput from "./components/ExpenseInput";
import ExpenseTable from "./components/ExpenseTable";
import FutureValue from "./components/FutureValue";
import ProfileCard from "./components/ProfileCard";
import { expense } from "./components/types";
import "./styles/css/App.min.css";
import heroPic from "./assets/business.jpg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function App() {
    const url = "https://moneymatters-backend-production.up.railway.app/api/v1";
    const [userLogin, setUserLogin] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [userIncome, setUserIncome] = useState(0);
    const [userExpenseList, setUserExpenseList] = useState<Array<expense>>([]);
    const [userTotalExpense, setUserTotalExpense] = useState(0);
    const [userNetIncome, setUserNetIncome] = useState(0);
    const [tableExpenses, setTableExpenses] = useState<Array<expense>>([]);
    function resetUser() {
        setUserLogin("");
        setUserIncome(0);
        setUserExpenseList([]);
        setUserNetIncome(0);
        setUserTotalExpense(0);
        console.log("logged out");
    }

    const handleModalClose = () => setIsModalOpen(false);
    const handleModalOpen = () => {
        console.log("modal opened");
        setUserLogin("");
    };
    function handleUserLoginSubmit(e: React.FormEvent) {
        e.preventDefault();
        //@ts-ignore
        const { value } = e.target[0];
        axios.get(`${url}/${value}`).then((res) => {
            if (res.data.httpStatus.body === "NOT_FOUND") {
                axios.post(`${url}/${value}`).then((res) => {
                    let user = res.data.user;
                    setUserLogin(user.username);
                    setUserIncome(user.monthlyIncome);
                    setUserExpenseList(user.expenses);
                });
            } else if (res.data.httpStatus.body === "OK") {
                let user = res.data.user;
                setUserLogin(user.username);
                setUserIncome(user.monthlyIncome);
                setUserExpenseList((prev) => {
                    return user.expenses;
                });
                let net = user.monthlyIncome;
                let total = 0;
                user.expenses.forEach((expense: expense) => {
                    let freq = expense.frequencyOfExpenseMonthly;
                    if (freq == "Monthly") {
                        freq = 1;
                    } else if (freq == "Bi-Weekly") {
                        freq = 2;
                    } else if (freq == "Weekly") {
                        freq = 4;
                    } else if (freq == "Daily") {
                        freq = 4;
                    }
                    //@ts-ignore
                    net = net - expense.expenseAmount * freq;
                    //@ts-ignore
                    total = total + expense.expenseAmount * freq;
                });
                setUserNetIncome((prev) => {
                    return net;
                });
                setUserTotalExpense((prev) => {
                    return total;
                });
            } else {
                console.log("error going on");
            }
        });
    }
    function handleAddExpense(ex: expense) {
        console.log("expense added");
        setUserExpenseList((prev) => {
            return [...prev, ex];
        });
    }
    function handleDeleteExpense(id: number) {
        console.log("deleted expense", id);
        axios.delete(`${url}/${userLogin}/deleteex/${id}`).then((res) =>
            axios.get(`${url}/${userLogin}`).then((res) => {
                console.log(res);
                setUserExpenseList(res.data.user.expenses);
            })
        );
    }

    const modalBoxStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        height: "40%",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    //useEffect for updating user net income AND total expenses
    useEffect(() => {
        let net = userIncome;
        let total = 0;
        userExpenseList.map((expense) => {
            let freq = expense.frequencyOfExpenseMonthly;
            if (freq == "Monthly") {
                freq = 1;
            } else if (freq == "Bi-Weekly") {
                freq = 2;
            } else if (freq == "Weekly") {
                freq = 4;
            } else if (freq == "Daily") {
                freq = 4;
            }
            //@ts-ignore
            net = net - expense.expenseAmount * freq;
            //@ts-ignore
            total = total + expense.expenseAmount * freq;
        });
        setUserNetIncome((prev) => {
            return net;
        });
        setUserTotalExpense((prev) => {
            return total;
        });
    }, [userIncome, userExpenseList]);

    //use effect for formatting expenses specifically for the table NOT for the chart
    useEffect(() => {
        let formattedExpenses: Array<expense> = [];
        userExpenseList.map((_expense: expense) => {
            let expense = _expense;
            let freq = expense.frequencyOfExpenseMonthly;
            if (freq == 1) {
                expense.frequencyOfExpenseMonthly = "Monthly";
            } else if (freq == 2) {
                expense.frequencyOfExpenseMonthly = "Bi-Weekly";
            } else if (freq == 4) {
                expense.frequencyOfExpenseMonthly = "Weekly";
            } else if (freq == 30) {
                expense.frequencyOfExpenseMonthly = "Daily";
            }
            let newCreate = expense.createdDate.slice(0, 10);
            let newUpdate = expense.updatedDate.slice(0, 10);
            expense.createdDate = newCreate;
            expense.updatedDate = newUpdate;
            formattedExpenses.push(expense);
        });
        setTableExpenses(formattedExpenses);
    }, [userExpenseList]);

    function handleUpdateIncome(e: React.FormEvent) {
        e.preventDefault();
        //@ts-ignore
        const newIncome = e.target.income.value;
        axios.put(`${url}/${userLogin}/updateincome/${newIncome}`).then((res) => console.log(res.data));
        setUserIncome((prev) => {
            return newIncome;
        });
    }

    function handleUpdateExpense(expense: expense) {
        console.log("good");
        console.log(expense);
        const newExpenseList: Array<expense> = [];
        axios.put(`${url}/${userLogin}/updateex`, expense).then((res) => {
            console.log(res);
            const newExpense = res.data.expense;

            userExpenseList.map((ex) => {
                if (ex.id === newExpense.id) {
                    ex = newExpense;
                    newExpenseList.push(ex);
                } else {
                    newExpenseList.push(ex);
                }
            });
            setUserExpenseList(newExpenseList);
        });
    }

    return (
        <div className="app-wrapper mt-5">
            <div className="">
                {!userLogin ? (
                    <Modal open={isModalOpen} onClose={handleModalClose}>
                        <Box sx={modalBoxStyle}>
                            <div className="modal-flex">
                                <h1 className="m-4">Login!</h1>
                                <Box component="form" onSubmit={handleUserLoginSubmit} className="d-flex flex-column align-items-center">
                                    <TextField className="my-2" name="username" label="Username" />
                                    <Button type="submit" className="mt-1" variant="outlined" sx={{ height: "2em", width: "1em", padding: ".25em", margin: "0 .5em" }} color="success">
                                        Login
                                    </Button>
                                </Box>
                            </div>
                        </Box>
                    </Modal>
                ) : null}
                {!userLogin ? null : (
                    <>
                        <div className="hero paddings">
                            <h1 className="hero-title header-font">Money Matters</h1>
                            <div className="hero-sub">
                                <h2 className="hero-subtitle header-font">Tracking your expenses and monthly investments for a better future</h2>
                                <img className="hero-image" src={heroPic} />
                            </div>
                        </div>
                        <div className="row justify-content-between flex-wrap align-items-center paddings bg-clr-sub ">
                            <div className="col-md-2 col-4 text-end order-md-3">
                                <h2 className="main-font">Your profile stats! Update your monthly income here</h2>
                                <div className="">
                                    <ArrowForwardIcon />
                                </div>
                            </div>
                            <div className="col-md-4 col-8 mb-5 mb-md-0 order-md-4">
                                <ProfileCard
                                    profileUserName={userLogin}
                                    profileMonthlyIncome={userIncome}
                                    handleModalOpen={handleModalOpen}
                                    logout={resetUser}
                                    netIncome={userNetIncome}
                                    totalExpense={userTotalExpense}
                                    updateIncome={handleUpdateIncome}
                                />
                            </div>
                            <div className="expense-input-wrapper col-md-4 col-8 order-md-1">
                                <ExpenseInput username={userLogin} addExpense={handleAddExpense} />
                            </div>
                            <div className="col-md-2 col-4 order-md-2 test">
                                <h2 className="main-font">Input your reoccuring expenses here to add them to your account</h2>
                                <div>
                                    <ArrowBackIcon />
                                </div>
                            </div>
                        </div>
                        <div className="row my-5 justify-content-center paddings">
                            <div className="col-auto">
                                <h2 className="text-center main-font">All currently added expenses</h2>
                                <ExpenseTable expenses={tableExpenses} deleteExpense={handleDeleteExpense} updateExpense={handleUpdateExpense} />
                            </div>
                        </div>

                        <div className="row my-5 bg-clr-sub paddings">
                            <div className="col-12 expense-chart-wrapper">
                                <div>
                                    <h2 className="main-font py-md-4 py-1 text-center">Being able to visualize which expenses dominate your budget every month is incredibly important</h2>
                                    <h2 className="main-font py-md-4 py-1 text-center">
                                        If you want to be increasing your net flow of cash at the end of the month, ask yourself which of these can be reduced!
                                    </h2>
                                </div>
                                <div>
                                    <ExpenseChart userExpenseList={userExpenseList} />
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center my-5 paddings ">
                            {userNetIncome > 0 ? (
                                <div className="w-75">
                                    <h2 className="main-font">
                                        This is your monthly profit if it was all invested each month. The average return on the stock market over time is 10%. This chart shows that average +- 2%
                                    </h2>
                                    <FutureValue netIncome={userNetIncome} />
                                </div>
                            ) : (
                                <h2 className="header-font">DO NOT HAVE ENOUGH INCOME TO INVEST</h2>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
