import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Report } from "./report-types";

export const analyzeCompany = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ company: z.string().min(1).max(80) }).parse(input),
  )
  .handler(async ({ data }): Promise<Report> => {
    const { generateReport } = await import("./report.server");
    return generateReport(data.company);
  });
