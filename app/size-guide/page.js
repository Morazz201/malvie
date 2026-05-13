export default function SizeGuide() {
  return (
    <div className="size-guide-container">
      <h1 className="size-guide-title">Size Guide</h1>
      <div className="size-guide-table-wrapper">
        <table className="size-guide-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Bust (in)</th>
              <th>Waist (in)</th>
              <th>Hip (in)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>XS</td>
              <td>32-33</td>
              <td>24-25</td>
              <td>34-35</td>
            </tr>
            <tr>
              <td>S</td>
              <td>34-35</td>
              <td>26-27</td>
              <td>36-37</td>
            </tr>
            <tr>
              <td>M</td>
              <td>36-37</td>
              <td>28-29</td>
              <td>38-39</td>
            </tr>
            <tr>
              <td>L</td>
              <td>38-40</td>
              <td>30-32</td>
              <td>40-42</td>
            </tr>
            <tr>
              <td>XL</td>
              <td>41-43</td>
              <td>33-35</td>
              <td>43-45</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="size-guide-note">
        All Malvie tees are oversized fit. For a more relaxed look, we recommend your usual size or size up once for an extra slouchy feel. For a fitted look, size down once.
      </p>
    </div>
  );
}
