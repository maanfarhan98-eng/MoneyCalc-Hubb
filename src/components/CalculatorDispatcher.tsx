import React from 'react';
import { PercentageCalculator } from './calculators/PercentageCalculator';
import { DiscountCalculator } from './calculators/DiscountCalculator';
import { TipCalculator } from './calculators/TipCalculator';
import { AgeCalculator } from './calculators/AgeCalculator';
import { CommissionCalculator } from './calculators/CommissionCalculator';
import { MarkupCalculator } from './calculators/MarkupCalculator';
import { ProfitCalculator } from './calculators/ProfitCalculator';
import { ProfitMarginCalculator } from './calculators/ProfitMarginCalculator';
import { BreakEvenCalculator } from './calculators/BreakEvenCalculator';
import { RoiCalculator } from './calculators/RoiCalculator';
import { SalaryCalculator } from './calculators/SalaryCalculator';
import { OvertimePayCalculator } from './calculators/OvertimePayCalculator';
import { PayRaiseCalculator } from './calculators/PayRaiseCalculator';
import { LoanCalculator } from './calculators/LoanCalculator';
import { SimpleInterestCalculator } from './calculators/SimpleInterestCalculator';
import { CompoundInterestCalculator } from './calculators/CompoundInterestCalculator';
import { MonthlyPaymentCalculator } from './calculators/MonthlyPaymentCalculator';
import { InterestRateCalculator } from './calculators/InterestRateCalculator';
import { LoanPayoffCalculator } from './calculators/LoanPayoffCalculator';
import { InvestmentCalculator } from './calculators/InvestmentCalculator';
import { SavingsCalculator } from './calculators/SavingsCalculator';
import { CompoundInterestInvestmentCalculator } from './calculators/CompoundInterestInvestmentCalculator';
import { ReturnOnInvestmentCalculator } from './calculators/ReturnOnInvestmentCalculator';

interface DispatcherProps {
  slug: string;
}

export function CalculatorDispatcher({ slug }: DispatcherProps) {
  switch (slug) {
    case 'percentage-calculator':
      return <PercentageCalculator />;
    case 'discount-calculator':
      return <DiscountCalculator />;
    case 'tip-calculator':
      return <TipCalculator />;
    case 'age-calculator':
      return <AgeCalculator />;
    case 'commission-calculator':
      return <CommissionCalculator />;
    case 'markup-calculator':
      return <MarkupCalculator />;
    case 'profit-calculator':
      return <ProfitCalculator />;
    case 'profit-margin-calculator':
      return <ProfitMarginCalculator />;
    case 'break-even-calculator':
      return <BreakEvenCalculator />;
    case 'roi-calculator':
      return <RoiCalculator />;
    case 'salary-calculator':
      return <SalaryCalculator />;
    case 'overtime-pay-calculator':
      return <OvertimePayCalculator />;
    case 'pay-raise-calculator':
      return <PayRaiseCalculator />;
    case 'loan-calculator':
      return <LoanCalculator />;
    case 'simple-interest-calculator':
      return <SimpleInterestCalculator />;
    case 'compound-interest-calculator':
      return <CompoundInterestCalculator />;
    case 'monthly-payment-calculator':
      return <MonthlyPaymentCalculator />;
    case 'interest-rate-calculator':
      return <InterestRateCalculator />;
    case 'loan-payoff-calculator':
      return <LoanPayoffCalculator />;
    case 'investment-calculator':
      return <InvestmentCalculator />;
    case 'savings-calculator':
      return <SavingsCalculator />;
    case 'compound-interest-investment-calculator':
      return <CompoundInterestInvestmentCalculator />;
    case 'return-on-investment-calculator':
      return <ReturnOnInvestmentCalculator />;
    default:
      return <div>Calculator not found.</div>;
  }
}
