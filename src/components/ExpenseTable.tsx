import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import UpgradeRoundedIcon from "@mui/icons-material/UpgradeRounded";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import type { expense, expenseTableProps } from "./types";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

export default function ExpenseTable({ expenses, deleteExpense, updateExpense }: expenseTableProps) {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [exName, setExName] = useState("");
    const [exType, setExType] = useState("");
    const [exAmount, setExAmount] = useState(0);
    const [exFrequency, setExFrequency] = useState<string | number>("");
    const [id, setId] = useState(0);

    function handleExpenseUpdateModalOpen(expense: expense) {
        console.log(expense);
        setExName(expense.nameOfExpense);
        setExType(expense.typeOfExpense);
        setExAmount(expense.expenseAmount);
        if (expense.frequencyOfExpenseMonthly === "Monthly") {
            setExFrequency(1);
        } else if (expense.frequencyOfExpenseMonthly === "Bi-Weekly") {
            setExFrequency(2);
        } else if (expense.frequencyOfExpenseMonthly === "Weekly") {
            setExFrequency(4);
        } else if (expense.frequencyOfExpenseMonthly === "Daily") {
            setExFrequency(30);
        }
        setId(expense.id);
        setIsUpdateModalOpen(true);
    }
    function handleExpenseUpdateModalClose() {
        setIsUpdateModalOpen(false);
    }
    function handleUpdateExpenseSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        //@ts-ignore
        let nameOfExpense = e.target.name.value;
        //@ts-ignore
        let typeOfExpense = e.target.type.value;
        //@ts-ignore
        let expenseAmount = parseInt(e.target.amount.value);
        //@ts-ignore
        let frequencyOfExpenseMonthly = e.target.frequency.value;

        const expense = { id, nameOfExpense, typeOfExpense, expenseAmount, frequencyOfExpenseMonthly };

        updateExpense(expense);
        handleExpenseUpdateModalClose();
    }
    const theme = createTheme({
        typography: {
            fontFamily: "Poppins, sans-serif",
        },
    });
    const updateExpenseModalBoxStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        height: "38%",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 2,
    };
    return (
        <>
            {isUpdateModalOpen ? (
                <Modal open={isUpdateModalOpen} onClose={handleExpenseUpdateModalClose}>
                    <Box component="form" sx={updateExpenseModalBoxStyle} onSubmit={handleUpdateExpenseSubmit}>
                        <h3 className="text-center mb-3">Update Expense</h3>
                        <div className="update-modal-form-container">
                            <div className="d-flex flex-column">
                                <label htmlFor={"name"}>Name</label>
                                <TextField variant="outlined" required name="name" defaultValue={exName} />
                            </div>
                            <div className="d-flex flex-column">
                                <label htmlFor={"type"}>Type</label>
                                <TextField variant="outlined" required defaultValue={exType} name="type" />
                            </div>
                            <div className="d-flex flex-column">
                                <label htmlFor={"amount"}>Amount</label>
                                <TextField type="number" variant="outlined" required defaultValue={exAmount} name="amount" />
                            </div>
                            <div className="d-flex flex-column">
                                <label htmlFor={"frequency"}>Frequency</label>
                                <FormControl>
                                    <Select defaultValue={exFrequency} required name="frequency">
                                        <MenuItem value={1}>Monthly</MenuItem>
                                        <MenuItem value={2}>Bi-Weekly</MenuItem>
                                        <MenuItem value={4}>Weekly</MenuItem>
                                        <MenuItem value={30}>Daily</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Button type="submit" variant="contained" color="success" className="mx-4 btn-expand">
                                Submit
                            </Button>
                            <Button variant="outlined" color="error" className="mx-4 btn-expand" onClick={handleExpenseUpdateModalClose}>
                                Cancel
                            </Button>
                        </div>
                    </Box>
                </Modal>
            ) : null}
            <ThemeProvider theme={theme}>
                <TableContainer component={Paper}>
                    <Table sx={{ border: "3px solid black" }} aria-label="simple table">
                        <TableHead>
                            <TableRow className="font-weight-bold">
                                <TableCell>Name of Expense</TableCell>
                                <TableCell align="right" className="font-weight-bold">
                                    Type of Expense
                                </TableCell>
                                <TableCell align="right" className="font-weight-bold">
                                    Amount (in $USD)
                                </TableCell>
                                <TableCell align="right" className="font-weight-bold">
                                    Frequency Paid
                                </TableCell>
                                <TableCell align="right" className="font-weight-bold">
                                    Created || Updated
                                </TableCell>
                                <TableCell align="center" className="font-weight-bold">
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((row) => (
                                <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {row.nameOfExpense}
                                    </TableCell>
                                    <TableCell align="right">{row.typeOfExpense}</TableCell>
                                    <TableCell align="right">${row.expenseAmount}</TableCell>
                                    <TableCell align="right">{row.frequencyOfExpenseMonthly}</TableCell>
                                    <TableCell align="right">
                                        {row.createdDate} || {row.updatedDate}
                                    </TableCell>
                                    <TableCell className="border border-left">
                                        <div>
                                            <Tooltip
                                                title={<Typography fontSize={"1.4em"}>Update</Typography>}
                                                TransitionComponent={Zoom}
                                                TransitionProps={{ timeout: 700 }}
                                                arrow={true}
                                                placement="left"
                                            >
                                                <Button
                                                    variant="outlined"
                                                    sx={{ height: "2em", minWidth: "2em", padding: ".25em", margin: "0 .5em" }}
                                                    className="btn-expand"
                                                    color="secondary"
                                                    onClick={() => handleExpenseUpdateModalOpen(row)}
                                                >
                                                    <UpgradeRoundedIcon />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip
                                                title={<Typography fontSize={"1.4em"}>Delete</Typography>}
                                                TransitionComponent={Zoom}
                                                TransitionProps={{ timeout: 700 }}
                                                arrow={true}
                                                placement="right"
                                            >
                                                <Button
                                                    variant="outlined"
                                                    sx={{ height: "2em", minWidth: "2em", padding: ".25em", margin: "0 .5em" }}
                                                    onClick={() => deleteExpense(row.id)}
                                                    className="btn-expand"
                                                    color="error"
                                                >
                                                    <DeleteRoundedIcon />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ThemeProvider>
        </>
    );
}
