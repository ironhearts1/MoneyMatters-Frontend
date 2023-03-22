import { Box, Button, Modal, TextField } from "@mui/material";
import { profile } from "console";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, ListGroup, ListGroupItem } from "reactstrap";
import type { profileProps } from "./types";

function ProfileCard({ profileUserName, handleModalOpen, profileMonthlyIncome, logout, netIncome, totalExpense, updateIncome }: profileProps) {
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

    function handleUserIncomeModalOpen() {
        setIsIncomeModalOpen(true);
    }
    function handleUserIncomeModalClose() {
        setIsIncomeModalOpen(false);
    }
    function handleLogout() {
        handleModalOpen();
        logout();
    }
    function handleUpdateIncome(e: React.FormEvent) {
        updateIncome(e);
        handleUserIncomeModalClose();
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
    return (
        <>
            {isIncomeModalOpen ? (
                <Modal open={isIncomeModalOpen} onClose={handleUserIncomeModalClose}>
                    <Box sx={modalBoxStyle}>
                        <div className="modal-flex">
                            <h1 className="m-4">Update Income!</h1>
                            <Box component="form" onSubmit={handleUpdateIncome} className="d-flex flex-column align-items-center">
                                <TextField className="my-2" name="income" label="Update Monthly Income" defaultValue={profileMonthlyIncome} />
                                <Button type="submit" className="mt-1" variant="outlined" sx={{ height: "2em", width: "1em", padding: ".25em", margin: "0 .5em" }} color="secondary">
                                    Update
                                </Button>
                            </Box>
                        </div>
                    </Box>
                </Modal>
            ) : null}
            <Card
                style={{
                    maxWidth: "18rem",
                    margin: "0",
                    alignSelf: "end",
                }}
            >
                <CardHeader>
                    <div className="profile-card-flex">
                        <h1 style={{ fontWeight: "700", fontSize: "1.25em" }}>Profile</h1>
                        <Button variant="contained" color="error" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </CardHeader>
                <ListGroup flush>
                    <ListGroupItem>Username: {`${profileUserName}`}</ListGroupItem>
                    <ListGroupItem className="my-1">
                        <Box component="form" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className="profile-media-query">
                            <p style={{ marginBottom: "0" }}>Monthly Income: {profileMonthlyIncome === undefined ? 0 : profileMonthlyIncome}</p>
                            <Button variant="outlined" sx={{ height: "2em", width: "1em", padding: ".25em" }} color="secondary" className="" onClick={handleUserIncomeModalOpen}>
                                Update
                            </Button>
                        </Box>
                    </ListGroupItem>
                    <ListGroupItem>{`Total Monthly Expenses: $${totalExpense}`}</ListGroupItem>
                    <ListGroupItem>
                        Net Monthly Cashflow: <p style={{ display: "inline", color: "green" }}>{`${netIncome === undefined ? 0 : netIncome}`}</p>
                    </ListGroupItem>
                </ListGroup>
            </Card>
        </>
    );
}

export default ProfileCard;
