"use client";

import { useState, useEffect, useMemo } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Select, InputNumber } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons"; // Import Ant Design arrow icon

const icons = import.meta.glob("/src/assets/icons/*.svg", { eager: true });

function App() {
  const [tokens, setTokens] = useState([]);

  const [inputSelected, setInputSelected] = useState<string>("USD");
  const [outputSelected, setOutputSelected] = useState<string>("USD");
  const [exchangeToken, setExchangeToken] = useState<number>(0);

  const handleSwitchTokenInput = (value: string) => {
    setInputSelected(value);
  };

  const handleSwitchTokenOutput = (value: string) => {
    setOutputSelected(value);
  };

  const handleExchangeTokenChange = (value: number) => {
    setExchangeToken(value);
  };

  const output: number = useMemo(() => {
    const inputTokenPrice =
      tokens
        .find((token) => token?.currency === inputSelected)
        ?.price.toFixed(2) || 1;
    const outputTokenPrice =
      tokens
        .find((token) => token?.currency === outputSelected)
        ?.price.toFixed(2) || 1;

    return ((exchangeToken * inputTokenPrice) / outputTokenPrice).toFixed(2);
  }, [exchangeToken, inputSelected, outputSelected]);

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((res) => res.json())
      .then((res) =>
        Array.from(
          new Map(
            res.map((item) => [
              item.currency,
              {
                ...item,
                icon:
                  `/src/assets/icons/${item.currency.toUpperCase()}.svg` || "",
              },
            ])
          ).values()
        )
      )
      .then((json) => setTokens(json))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="swap-container">
      <div className="swap-header">Crypto Exchange</div>
      <div className="swap-content">
        <div className="swap-section">
          <Select
            className="select-box"
            showSearch
            placeholder="Select currency to swap"
            filterOption={(input, option) =>
              option?.value.toLowerCase().includes(input.toLowerCase())
            }
            onChange={handleSwitchTokenInput}
            defaultValue={inputSelected}
            style={{ width: 150 }}
          >
            {tokens.map(({ currency, price, icon }) => (
              <Select.Option key={currency} value={currency}>
                <div className="select-option">
                  <img src={icon} alt={currency} className="currency-icon" />{" "}
                  {currency}
                </div>
              </Select.Option>
            ))}
          </Select>
          <InputNumber
            className="input-number"
            min={0}
            defaultValue={exchangeToken}
            onChange={handleExchangeTokenChange}
          />
        </div>

        <ArrowDownOutlined className="arrow-icon" />

        <div className="swap-section">
          <Select
            className="select-box"
            showSearch
            placeholder="Select currency to exchange"
            filterOption={(input, option) =>
              option?.value.toLowerCase().includes(input.toLowerCase())
            }
            onChange={handleSwitchTokenOutput}
            defaultValue={inputSelected}
            style={{ width: 150 }}
          >
            {tokens.map(({ currency, price, icon }) => (
              <Select.Option key={currency} value={currency}>
                <div className="select-option">
                  <img src={icon} alt={currency} className="currency-icon" />{" "}
                  {currency}
                </div>
              </Select.Option>
            ))}
          </Select>
          <InputNumber
            className="input-number"
            defaultValue={output}
            readOnly
            value={output}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
