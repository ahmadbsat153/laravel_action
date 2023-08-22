import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const PdfPreview = ({ pdfUrls }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [activeFile, setActiveFile] = useState(0);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const goToPrevPage = () =>
        setPageNumber((prevPage) => (prevPage - 1 <= 1 ? 1 : prevPage - 1));

    const goToNextPage = () =>
        setPageNumber((prevPage) =>
            prevPage + 1 >= numPages ? numPages : prevPage + 1
        );

    function handleFileChange(index) {
        setActiveFile(index);
    }

    if (!pdfUrls || pdfUrls.length === 0) {
        return <div className="flex justify-center items-center h-[40rem]">No PDFs to display</div>;
    }

    return (
        <div>
            <nav className="flex gap-x-2 py-2 ">
                {pdfUrls?.length > 0
                    ? pdfUrls.map((url, index) => (
                          <button
                              key={index}
                              className="px-2 py-1 border rounded-lg bg-gray-700 rounded text-smooth"
                              onClick={() => {
                                setPageNumber(1)
                                  handleFileChange(index);
                              }}
                          >
                              File {index + 1}
                          </button>
                      ))
                    : null}
            </nav>
            <div className="overflow-y-scroll containerscroll h-[40rem]">
                <Document
                    onLoadError={console.error}
                    file={`Invoices/${pdfUrls[activeFile]?.DocName}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false} // Disable rendering of text layer
                    />
                </Document>
            </div>
            
            <nav className="flex gap-x-2 py-2 justify-center items-center text-sm">
                <button
                    onClick={goToPrevPage}
                    className="px-3 py-1 border flex bg-gray-800 rounded-lg text-smooth"
                >
                  <ChevronLeftIcon className="mr-1 h-5" />  
                  <span>Prev</span>
                </button>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
                <button
                    onClick={goToNextPage}
                    className="px-3 py-1 flex border bg-gray-800 rounded-lg text-smooth"
                >
                   <span> Next</span>
                    <ChevronRightIcon className="ml-1 h-5" />
                </button>
                
            </nav>
        </div>
    );
};

export default PdfPreview;
