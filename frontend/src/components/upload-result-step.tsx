import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "./shared-styles";
import { IEncryptedData } from "../constants";
import styled from "styled-components";

const DataList = styled.div`
    display: flex;
    flex-direction: column;
`;

const LongText = styled.div`
    text-overflow: ellipsis;
    width: 154px;
    overflow: hidden;
`;

const DeleteIcon = styled.div`
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke-width='2' stroke='%23fb4105' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M4 7l16 0' /%3E%3Cpath d='M10 11l0 6' /%3E%3Cpath d='M14 11l0 6' /%3E%3Cpath d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12' /%3E%3Cpath d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' /%3E%3C/svg%3E");
    height: 25px;
    width: 25px;
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 15px;
`;

export const UploadResultStep = (
    { encryptedData, clearEncryptionResult }:
        { encryptedData?: IEncryptedData; clearEncryptionResult: () => void; }
) => {
    return <Card>
        <CardTitle>Upload Result</CardTitle>

        {
            !encryptedData
                ? "Upload a file first..."
                :
                <>
                    <DeleteIcon onClick={clearEncryptionResult} />

                    <DataList>
                        <div>Asset ID</div>
                        <LongText>{encryptedData.assetId.toString()}</LongText>
                        <br />
                        <div>ciphertext</div>
                        <LongText>{encryptedData.ciphertext}</LongText>
                        <br />
                        <div>dataToEncryptHash</div>
                        <LongText>{encryptedData.dataToEncryptHash}</LongText>
                    </DataList>
                </>
        }

    </Card>;
};
