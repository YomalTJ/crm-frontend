import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

// Interface adapted for beneficiary payments or disbursements
interface BeneficiaryPayment {
  id: number;
  beneficiaryName: string; // Beneficiary full name
  program: string; // Program name or category (e.g., "Samurdhi Welfare", "Microfinance")
  amount: string; // Amount disbursed (e.g., "Rs. 15,000")
  status: "Paid" | "Pending" | "Failed"; // Payment status
  photo?: string; // Optional photo of beneficiary or icon
}

const tableData: BeneficiaryPayment[] = [
  {
    id: 1,
    beneficiaryName: "Kumara Perera",
    program: "Samurdhi Welfare",
    amount: "Rs. 15,000",
    status: "Paid",
    photo: "/images/user/user-01.jpg",
  },
  {
    id: 2,
    beneficiaryName: "Nimalka Jayawardena",
    program: "Microfinance Loan",
    amount: "Rs. 30,000",
    status: "Pending",
    photo: "/images/user/user-02.jpg",
  },
  {
    id: 3,
    beneficiaryName: "Sunil Fernando",
    program: "Samurdhi Welfare",
    amount: "Rs. 12,500",
    status: "Paid",
    photo: "/images/user/user-03.jpg",
  },
  {
    id: 4,
    beneficiaryName: "Dilani Wickramasinghe",
    program: "Skills Development",
    amount: "Rs. 5,000",
    status: "Failed",
    photo: "/images/user/user-04.jpg",
  },
  {
    id: 5,
    beneficiaryName: "Amara Silva",
    program: "Samurdhi Welfare",
    amount: "Rs. 15,000",
    status: "Paid",
    photo: "/images/user/user-05.jpg",
  },
];

export default function RecentBeneficiaryPayments() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Beneficiary Payments
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Beneficiary
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Program
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount Disbursed
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    {payment.photo ? (
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                        <Image
                          width={50}
                          height={50}
                          src={payment.photo}
                          alt={payment.beneficiaryName}
                          className="h-[50px] w-[50px] object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-[50px] w-[50px] rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 font-semibold">
                        {payment.beneficiaryName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {payment.beneficiaryName}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {payment.program}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {payment.amount}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      payment.status === "Paid"
                        ? "success"
                        : payment.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
