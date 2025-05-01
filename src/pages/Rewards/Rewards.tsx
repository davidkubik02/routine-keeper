import React, { useEffect, useState } from "react";
import Menu from "../../navigation/Menu";
import Button from "../../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Rewards() {
  const [rewards, setRewards] = useState<{ description: string; id: string }[]>([]);
  const getRewards = async () => {
    const rewards = await axios.get("http://localhost:8080/evaluation/getRewards", {
      withCredentials: true,
    });
    setRewards(rewards.data);
  };
  useEffect(() => {
    getRewards();
  }, []);

  const collectReward = async (id: string) => {
    if (!window.confirm("Chcete vyzvednout tento úkol?")) {
      return;
    }
    const response = await axios.delete("http://localhost:8080/evaluation/collectReward", {
      params: {
        id,
      },
      withCredentials: true,
    });
    alert(response.data);
    navigate("/routine-keeper");
  };
  const navigate = useNavigate();
  return (
    <div className="page-container">
      <header className="header">
        <Menu />
      </header>
      <h3>Kliknutím na tlačítko vyzvedneš odměnu</h3>
      <br />
      {rewards.length ? (
        rewards.map((reward) => {
          return (
            <Button
              key={reward.id}
              type="button"
              clickHandle={() => collectReward(reward.id)}
              value={reward.description}
            />
          );
        })
      ) : (
        <div>Žádná odměna není k dispozici</div>
      )}
    </div>
  );
}

export default Rewards;
