window.onload = async () => {
  try {
    const response = await fetch("http://localhost:3000/counties");
    const counties = await response.json();

    // Initialize national tally
    let totalVotes = {
      UDA: 0,
      Azimio: 0,
      DCP: 0,
      Independent: 0,
    };

    counties.forEach((county) => {
      const countyEl = document.getElementById(county.id); // e.g., KE-001

      if (countyEl) {
        const leader = county.candidates.find(c => c.name === county.leadingCandidate);
        if (!leader) return;

        // Color the county based on the leader
        countyEl.style.fill = leader.partyColor;

        // Add click event to show county-level details
        countyEl.addEventListener("click", () => {
          document.getElementById("county-name").textContent = county.name;

          let votesUda = 0, votesOdm = 0, votesUpa = 0, votesDcp = 0;

          county.candidates.forEach((c) => {
            if (c.name === "William Ruto") votesUda = c.potentialVoters;
            else if (c.name === "Raila Odinga") votesOdm = c.potentialVoters;
            else if (c.name === "Fred Matiang'i") votesUpa = c.potentialVoters;
            else if (c.name === "Rigathi Gachagua") votesDcp = c.potentialVoters;
          });

          // Display county-level vote counts
          document.getElementById("votes-uda").textContent = votesUda.toLocaleString();
          document.getElementById("votes-odm").textContent = votesOdm.toLocaleString();
          document.getElementById("votes-upa").textContent = votesUpa.toLocaleString();
          document.getElementById("votes-dcp").textContent = votesDcp.toLocaleString();
          document.getElementById("winner").textContent = `${leader.name} (${leader.party})`;
        });

        // National Tally
        county.candidates.forEach((c) => {
          if (c.name === "William Ruto") totalVotes.UDA += c.potentialVoters;
          else if (c.name === "Raila Odinga") totalVotes.Azimio += c.potentialVoters;
          else if (c.name === "Fred Matiang'i") totalVotes.Independent += c.potentialVoters;
          else if (c.name === "Rigathi Gachagua") totalVotes.DCP += c.potentialVoters;
        });

      } else {
        console.warn(`SVG element not found: ${county.id}`);
      }
    });

    // Update national tally board at the top
    document.querySelector("#uda span").textContent = totalVotes.UDA.toLocaleString();
    document.querySelector("#odm span").textContent = totalVotes.Azimio.toLocaleString();
    document.querySelector("#dcp span").textContent = totalVotes.DCP.toLocaleString();
    document.querySelector("#jubilee span").textContent = totalVotes.Independent.toLocaleString();

    // Determine national winner
    const winner = Object.entries(totalVotes).reduce((max, entry) => {
      return entry[1] > max[1] ? entry : max;
    });

    document.querySelector("#winner span").textContent = `${winner[0]}: ${winner[1].toLocaleString()} votes`;

  } catch (error) {
    console.error("Failed to load or process county data:", error);
  }
};
