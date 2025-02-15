interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};

// Issue figure out:
// 1.Line 0: Import missing
// 2.Line 11: Interface extends but not added or override => suggested to use Type Alias
// 3.Line 13: Children had been destructuring but without use and it can be undefined => should remove for unnecessary or if use should bind default value
// 4.Line 17 function getPriority: blockchain using any => which is not good for type checking (the input show that it has string type)
// Consider add getPriority in useCallBack with [] dependencies for not re-create it
// Solution 1: better level for not know type => blockchain: unknown
// Solution 2: defined enum
// enum BlockChain {
//   Osmosis = "Osmosis" ,
//   Ethereum = "Ethereum",
// }
// const getPriority = (blockchain: BlockChain): number => {
//    return BlockChain[blockchain] ?? -99; // better performance
// }
// 5.Line 34 function sortedBalances:
// - Line 37: getPriority access blockchain attr but WalletBalance don't have it attribute
// Solution: type check interface consider add more attribute and mark it optional if it can be undefined or not
// - Line 37: balancePriority is defined but don't use consider remove it
// - Line 38 - 43: can reduce to return (lhsPriority > -99 && balance.amount <= 0)
// - Line 45 - 47 same issue with line 37
// - Line 48 - 52: can reduce to return leftPriority > rightPriority ? -1 : 1
// 6.Line 56 ormattedBalances: should have type for formattedBalances like <WalletBalance & {formatted:number}>[]
// 6.Line 56 formattedBalances: should be wrapped in useMemo[sortedBalances]
// 7.Line 63 rows: should be wrapped in useMemo[sortedBalances]
// 8.Line 65 can lead to run time error while accessing obj prices, make sure check it not null
// 9.Balances and prices when change don't trigger re-render to draw back rows
