import React from 'react';
import { FaFilePdf } from "react-icons/fa6";
import { FaFileExcel } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
const ChecklistAndEscalation = () => {
  return (
    <div className="bg-[#c1dff2]">
    <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">CHECKLIST AND ESCALATION MANAGER</h2>
      <div className="bg-white p-12  w-full mx-auto">
        <table className='m-auto w-1/2 border-collapse border  rounded-lg'>
          <thead>
            <tr className='bg-[#c1dff2] text-[#4d606b] whitespace-nowrap'>
              <th className='border  px-4 py-2'>SL NO</th>
              <th className='border  px-4 py-2'>PARTICULARS</th>
              <th className='border  px-4 py-2'>DOWNLOAD DOCUMENT</th>
            </tr>
          </thead>
          <tbody>
            <tr className=''>
              <td className='border  px-4 py-2'>1</td>
              <td className='border  px-4 py-2'>Employee Background Verification Standard Form</td>
              <td className='border  px-4 py-2 '>

                <a
                  href="http://screeningstar.in/chkmatrixfiles/Screeningstar_Standard_BackGround_Verification_Form.pdf"
                  download=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4"
                >
                  Standard PDF BGV Form
                  <FaFilePdf className="text-3xl mr-[50px]" />
                </a>
              </td>
            </tr>
            <tr>
              <td className='border  px-4 py-2'>2</td>
              <td className='border  px-4 py-2'>Employee Background Verification Standard Form</td>
              <td className='border  px-4 py-2'>
                <a
                  href="http://screeningstar.in/chkmatrixfiles/Screeningstar_Standard_BackGround_Verification_Form.xls"
                  download=""
                   className="flex items-center justify-between gap-3"
                >
                  Standard Excel BGV Form
                  <FaFileExcel className="text-3xl mr-[50px]"/>
                </a>
              </td>
            </tr>
            <tr>
              <td className='border  px-4 py-2'>3</td>
              <td className='border  px-4 py-2'>Checklist and List of documents required for BGV</td>
              <td className='border  px-4 py-2'>
                <a
                  href="http://screeningstar.in/chkmatrixfiles/DOCUMENT_CHECKLIST.pdf"
                  download=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3"
                >
                  Document Checklist
                  <IoDocumentTextSharp  className="text-3xl mr-[50px]"/>
                </a>
              </td>
            </tr>
            <tr>
              <td className='border  px-4 py-2'>4</td>
              <td className='border  px-4 py-2'>Screeningstar Colour Code Matrix</td>
              <td className='border  px-4 py-2'>
                <a
                  href="http://screeningstar.in/chkmatrixfiles/Colour_Code_Matrix.xlsx"
                  download=""
                   className="flex items-center justify-between gap-3"
                >
                  Colour Code Matrix
                  <FaFileExcel className="text-3xl mr-[50px]"/>
                </a>
              </td>
            </tr>
            <tr>
              <td className='border  px-4 py-2'>5</td>
              <td className='border  px-4 py-2'>Screeningstar Scope of Process</td>
              <td className='border  px-4 py-2'>
                <a
                  href="http://screeningstar.in/chkmatrixfiles/Scope_of_Process.pdf"
                  download=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3"
                >
                  Scope of Process
                  <FaFilePdf className="text-3xl mr-[50px]" />
                </a>
              </td>
            </tr>
            <tr>
              <td className='border  px-4 py-2'>6</td>
              <td className='border  px-4 py-2'>Business Proposal for Employee Background Verification Services</td>
              <td className='border  px-4 py-2'>
                <a
                  href="http://screeningstar.in/chkmatrixfiles/SCREENINGSTAR_BUSINESS_PROPOSAL_FOR_BGV.pdf"
                  download=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3"
                >
                  Business Proposal
                  <FaFilePdf className="text-3xl mr-[50px]" />
                </a>
              </td>
            </tr>
            <tr>
              <td className='border  px-4 py-2'>7</td>
              <td className='border  px-4 py-2'>Background Verification Sample Report</td>
              <td className='border  px-4 py-2'>
                <a
                  href="http://screeningstar.in/chkmatrixfiles/Screeningstar_Standard_BackGround_Verification_Form.pdf"
                  download=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3"
                >
                  Sample BGV Report
                  <FaFilePdf className="text-3xl mr-[50px]" />
                </a>
              </td>
            </tr>
            <tr>
              <td className='border  px-4 py-2'>8</td>
              <td className='border  px-4 py-2'>Candidate Absence Declaration/Consent form from Client</td>
              <td className='border  px-4 py-2'><a href="#">Absence Declaration Form</a></td>
            </tr>
            <tr>
              <td className='border  px-4 py-2'>9</td>
              <td className='border  px-4 py-2'>Client Authorization to Initiate the BGV to Screeningstar Solutions Pvt Ltd</td>
              <td className='border  px-4 py-2'><a href="#">Client Authorization Form</a></td>
            </tr>
            <tr>
              <td className='border  px-4 py-2'>10</td>
              <td className='border  px-4 py-2'>Escalation Matrix - Call dedicated Point of Contact or Email To</td>
              <td className='border  px-4 py-2'>
                <div>
                  <strong>1st Level: Ms. Ramya </strong><br />
                  Designation: Assistant Manager - Client Servicing<br />
                  Mobile Number: <a href="tel:8148750989">8148750989</a><br />
                  Email ID: <a href="mailto:bgv@screeningstar.com">bgv@screeningstar.com</a>
                </div>
                <div>
                  <strong>2nd Level: Mr. Manjunath HS</strong><br />
                  Designation: Head of Business Operations<br />
                  Mobile Number: <a href="tel:9945891310">9945891310</a><br />
                  Email ID: <a href="mailto:manjunath@screeningstar.com">manjunath@screeningstar.com</a>
                </div>
                <div>
                  <strong>Final level: Mrs Rajitha V </strong><br />
                  Designation: CEO <br />
                  Mobile Number: <a href="tel:9945891310">9620773267</a><br />
                  Email ID: <a href="mailto:admin@screeningstar.com">admin@screeningstar.com </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChecklistAndEscalation;
