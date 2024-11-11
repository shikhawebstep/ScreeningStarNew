import { React,useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const InvoiceMaster = () => {
    const [invoiceDate, setInvoiceDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [receivedDate, setReceivedDate] = useState(null);
    return (
        <>
    <div className="w-full bg-[#c1dff2] border overflow-hidden">
    <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">ENTER SALES DATA</h2>

                <div className="bg-white p-12 w-full mx-auto">
                    <form class="w-fullbg-[rgb(235_223_215)] p-6 space-y-4">
                        <div class="mb-4">
                            <select id="month" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2 appearance-none">
                                <option value="">Select Month</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <input id="organizationName" type="text" placeholder="Organization Name" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div class="mb-4">
                            <input id="gstNumber" type="text" placeholder="GST Number" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div class="mb-4">
                            <input id="state" type="text" placeholder="State" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div class="mb-4">
                            <input id="stateCode" type="text" placeholder="State Code" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div className="mb-4 w-full">
                        <DatePicker
                            selected={invoiceDate}
                            onChange={(date) => setInvoiceDate(date)}
                            dateFormat="yyyy/MM/dd"
                            placeholderText="Invoice Date"
                            name="invoiceDate"
                            className="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2 w-full"
                        />
                    </div>
                        <div class="mb-4">
                            <input id="invoiceNumber" type="text" placeholder="Invoice Number" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div class="mb-4">
                            <input id="taxableValue" type="number" placeholder="Taxable Value" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div class="mb-4 grid grid-cols-3 gap-4">
                            <input id="cgst" type="number" placeholder="CGST" class="bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                            <input id="sgst" type="number" placeholder="SGST" class="bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                            <input id="igst" type="number" placeholder="IGST" class="bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div class="mb-4">
                            <input id="totalGst" type="number" placeholder="Total GST" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div class="mb-4">
                            <input id="invoiceSubtotal" type="number" placeholder="Invoice Subtotal" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div className="mb-4">
                        <DatePicker
                            selected={dueDate}
                            onChange={(date) => setDueDate(date)}
                            dateFormat="yyyy/MM/dd"
                            placeholderText="Due Date"
                            name ="dueDate"
                            className="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                        <div class="mb-4">
                            <input id="paymentStatus" type="text" placeholder="Payment Status" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div className="mb-4">
                        <DatePicker
                            selected={receivedDate}
                            onChange={(date) => setReceivedDate(date)}
                            dateFormat="yyyy/MM/dd"
                            placeholderText="Received Date"
                            name="recievedDate"
                            className="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                        <div class="mb-4 grid grid-cols-2 gap-4">
                            <input id="tdsPercentage" type="number" placeholder="TDS Percentage" class="bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                            <input id="tdsDeducted" type="number" placeholder="TDS Deducted" class="bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div class="mb-4">
                            <input id="amountReceived" type="number" placeholder="Amount Received" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div class="mb-4">
                            <input id="balancePayment" type="number" placeholder="Balance Payment" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" />
                        </div>
                        <div class="mb-4">
                            <textarea id="paymentRemarks" placeholder="Payment Remarks" class="w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2"></textarea>
                        </div>
                        <div class="text-left">
                            <button type="submit" class="p-6 py-3 bg-[#2c81ba] text-white font-bold rounded-md hover:bg-blue-600">Submit</button>
                        </div>
                    </form>

                </div>


            </div>
        </>
    )
}

export default InvoiceMaster;
