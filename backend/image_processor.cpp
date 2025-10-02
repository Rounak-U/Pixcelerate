#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

#include <iostream>
#include <vector>
#include <string>
#include <filesystem>
#include "nlohmann/json.hpp"
#include <omp.h>

using namespace std;
using json = nlohmann::json;

struct Operation
{
    string type;
    json params;
};

inline unsigned char clamp(int val)
{
    return val < 0 ? 0 : (val > 255 ? 255 : val);
}

// Pixel-level operations
void apply_grayscale(unsigned char *data, int w, int h, int channels)
{
#pragma omp parallel for schedule(static)
    for (int y = 0; y < h; y++)
    {
        for (int x = 0; x < w; x++)
        {
            int idx = (y * w + x) * channels;
            unsigned char r = data[idx];
            unsigned char g = data[idx + 1];
            unsigned char b = data[idx + 2];
            unsigned char gray = static_cast<unsigned char>(0.299 * r + 0.587 * g + 0.114 * b);
            data[idx] = data[idx + 1] = data[idx + 2] = gray;
        }
    }
}

void apply_invert(unsigned char *data, int w, int h, int channels)
{
#pragma omp parallel for schedule(static)
    for (int y = 0; y < h; y++)
    {
        for (int x = 0; x < w; x++)
        {
            int idx = (y * w + x) * channels;
            for (int c = 0; c < 3; c++)
                data[idx + c] = 255 - data[idx + c];
        }
    }
}

void apply_brightness(unsigned char *data, int w, int h, int channels, int value)
{
#pragma omp parallel for schedule(static)
    for (int y = 0; y < h; y++)
    {
        for (int x = 0; x < w; x++)
        {
            int idx = (y * w + x) * channels;
            for (int c = 0; c < 3; c++)
                data[idx + c] = clamp(data[idx + c] + value);
        }
    }
}

void apply_contrast(unsigned char *data, int w, int h, int channels, double value)
{
    double factor = (259 * (value + 255)) / (255 * (259 - value));
#pragma omp parallel for schedule(static)
    for (int y = 0; y < h; y++)
    {
        for (int x = 0; x < w; x++)
        {
            int idx = (y * w + x) * channels;
            for (int c = 0; c < 3; c++)
                data[idx + c] = clamp(int(factor * (data[idx + c] - 128) + 128));
        }
    }
}

void apply_flip(unsigned char *data, int w, int h, int channels, bool horizontal, bool vertical)
{
    if (horizontal)
    {
#pragma omp parallel for schedule(static)
        for (int y = 0; y < h; y++)
        {
            for (int x = 0; x < w / 2; x++)
            {
                int idx1 = (y * w + x) * channels;
                int idx2 = (y * w + (w - 1 - x)) * channels;
                for (int c = 0; c < channels; c++)
                    swap(data[idx1 + c], data[idx2 + c]);
            }
        }
    }

    if (vertical)
    {
#pragma omp parallel for schedule(static)
        for (int y = 0; y < h / 2; y++)
        {
            for (int x = 0; x < w; x++)
            {
                int idx1 = (y * w + x) * channels;
                int idx2 = ((h - 1 - y) * w + x) * channels;
                for (int c = 0; c < channels; c++)
                    swap(data[idx1 + c], data[idx2 + c]);
            }
        }
    }
}

void apply_operations(unsigned char *data, int w, int h, int channels, const vector<Operation> &ops)
{
    for (const auto &op : ops)
    {
        if (op.type == "grayscale")
            apply_grayscale(data, w, h, channels);
        else if (op.type == "invert")
            apply_invert(data, w, h, channels);
        else if (op.type == "brightness")
            apply_brightness(data, w, h, channels, op.params["value"]);
        else if (op.type == "contrast")
            apply_contrast(data, w, h, channels, op.params["value"]);
        else if (op.type == "flip")
            apply_flip(data, w, h, channels,
                       op.params["horizontal"], op.params["vertical"]);
    }
}

int main(int argc, char **argv)
{
    if (argc < 3)
    {
        cerr << "Usage: ./image_processor num_images operations_json file1 file2 ...\n";
        return 1;
    }

    int num_images = stoi(argv[1]);
    json ops_json = json::parse(argv[2]);
    vector<Operation> operations;
    for (const auto &o : ops_json)
        operations.push_back({o["type"], o["params"]});

    filesystem::create_directories("processed");

    // Sequential timing
    double t_seq = omp_get_wtime();
    for (int i = 0; i < num_images; i++)
    {
        string file = argv[3 + i];
        int w, h, c;
        unsigned char *data = stbi_load(file.c_str(), &w, &h, &c, 3);
        if (!data)
            continue;
        c = 3;
        apply_operations(data, w, h, c, operations);
        string out = "processed/processed_seq_" + to_string(i) + ".png";
        stbi_write_png(out.c_str(), w, h, c, data, w * c);
        stbi_image_free(data);
    }
    t_seq = omp_get_wtime() - t_seq;

    // Parallel timing
    double t_par = omp_get_wtime();
#pragma omp parallel for schedule(dynamic)
    for (int i = 0; i < num_images; i++)
    {
        string file = argv[3 + i];
        int w, h, c;
        unsigned char *data = stbi_load(file.c_str(), &w, &h, &c, 3);
        if (!data)
            continue;
        c = 3;
        apply_operations(data, w, h, c, operations);
        string out = "processed/processed_par_" + to_string(i) + ".png";
        stbi_write_png(out.c_str(), w, h, c, data, w * c);
        stbi_image_free(data);
    }
    t_par = omp_get_wtime() - t_par;

    // Print processed images paths
    for (int i = 0; i < num_images; i++)
    {
        cout << "processed/processed_seq_" << i << ".png\n";
        cout << "processed/processed_par_" << i << ".png\n";
    }

    // Print times and speedup
    cout << "TIME_SEQ=" << t_seq << " seconds\n";
    cout << "TIME_PAR=" << t_par << " seconds\n";
    if (t_par > 0)
        cout << "SPEEDUP=" << (t_seq / t_par) << "x\n";
    else
        cout << "SPEEDUP=INF (parallel time is zero)\n";

    return 0;
}
