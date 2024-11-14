import React from 'react'

const GenerateInvoice = () => {
    return (
        <>

            <div className="w-full bg-[#c1dff2] border overflow-hidden">
                <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">GENERATE INVOICE</h2>
                <div className="bg-white text-left  p-12   w-full mx-auto">

                    <form action="pdf2/inv.php" method="post" enctype="multipart/form-data" target="_blank" autocomplete="off" class="space-y-4">
                        <div>
                            <label for="clrefin" class="block mb-2">Client Code:</label>
                            <input type="text" name="clrefin" id="clrefin" required class="w-full p-3 bg-[#f7f6fb] mb-[20px] border border-gray-300 rounded-md" />
                        </div>

                        <div>
                            <label for="invnum" class="block mb-2">Invoice Number:</label>
                            <input type="text" name="invnum" id="invnum" required class="w-full p-3 bg-[#f7f6fb] mb-[20px] border border-gray-300 rounded-md" />
                        </div>

                        <div>
                            <label for="invoice_date" class="block mb-2">Invoice Date:</label>
                            <input type="text" name="invoice_date" id="invoice_date" required class="w-full p-3 bg-[#f7f6fb] mb-[20px] border border-gray-300 rounded-md" />
                        </div>

                        <div>
                            <label for="moinv" class="block mb-2">Month:</label>
                            <select id="inmnth" name="inmnth" required class="w-full p-3 bg-[#f7f6fb] mb-[20px] border border-gray-300 rounded-md">
                                <option>--Select Month--</option>
                                <option value="01">January</option>
                                <option value="02">February</option>
                                <option value="03">March</option>
                                <option value="04">April</option>
                                <option value="05">May</option>
                                <option value="06">June</option>
                                <option value="07">July</option>
                                <option value="08">August</option>
                                <option value="09">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>

                            <select id="inyer" name="inyer" required class="w-full p-3 bg-[#f7f6fb] mb-[20px] border border-gray-300 rounded-md">
                                <option>--Select Year--</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>

                        <div class="text-left">
                            <button type="submit" class="p-6 py-3 bg-[#2c81ba] text-white font-bold rounded-md hover:bg-blue-600">Submit</button>
                        </div>
                    </form>


                </div >


            </div >
        </>
    )
}

export default GenerateInvoice;
