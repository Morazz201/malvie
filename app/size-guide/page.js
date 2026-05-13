export default function SizeGuide() {
  return (
    <div className="info-page-wrap">
      <h1 className="info-page-title" style={{ marginBottom: "32px" }}>Size Guide</h1>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead style={{ background: "var(--soft-pastel)" }}>
            <tr><th style={{ padding: "12px", border: "1px solid var(--light-border)" }}>Size</th><th style={{ padding: "12px", border: "1px solid var(--light-border)" }}>Bust (in)</th><th style={{ padding: "12px", border: "1px solid var(--light-border)" }}>Waist (in)</th><th style={{ padding: "12px", border: "1px solid var(--light-border)" }}>Hip (in)</th></tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: "12px", border: "1px solid var(--light-border)" }}>XS</td><td>32-33</td><td>24-25</td><td>34-35</td></tr>
            <tr><td style={{ padding: "12px", border: "1px solid var(--light-border)" }}>S</td><td>34-35</td><td>26-27</td><td>36-37</td></tr>
            <tr><td style={{ padding: "12px", border: "1px solid var(--light-border)" }}>M</td><td>36-37</td><td>28-29</td><td>38-39</td></tr>
            <tr><td style={{ padding: "12px", border: "1px solid var(--light-border)" }}>L</td><td>38-40</td><td>30-32</td><td>40-42</td></tr>
            <tr><td style={{ padding: "12px", border: "1px solid var(--light-border)" }}>XL</td><td>41-43</td><td>33-35</td><td>43-45</td></tr>
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: "32px", color: "var(--mid-gray)", fontSize: "14px" }}>All Malvie tees are oversized fit. For a more relaxed look, we recommend your usual size or size up once for an extra slouchy feel. For a fitted look, size down once.</p>
    </div>
  );
}