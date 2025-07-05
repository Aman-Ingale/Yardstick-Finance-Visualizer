import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#FF0000", "#FF7F00", "#FFFF00", "#7FFF00", "#00FF00"]; // Color gradient

export function HeatMap({ data }) {
  const transformedData = data?.map((item, index) => ({
    x: index,
    y: item.complianceScore,
    category: item.section,
    value: item.complianceScore,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Section"
            tickFormatter={(value) => data[value]?.section || ""}
          />
          <YAxis type="number" dataKey="y" name="Compliance Score" />
          <Tooltip
            formatter={(value, name, props) =>
              name === "Compliance Score"
                ? [`${value}`, "Score"]
                : [props.payload?.category || "", "Section"]
            }
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Scatter data={transformedData} fill="#8884d8" shape="square">
            {transformedData?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[Math.floor(entry.value / 20) % COLORS.length]} // Dynamic coloring
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
